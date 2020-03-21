/*
MIT License

Copyright (c) 2020 Olavo Alexandrino, http://www.oalexandrino.com.br

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');
var TeamMemberImageModel = mongoose.model('teamMemberImage');
var CloudinarySettings = require('../../lib/agency/upload/CloudinarySettings');
var responseUtilities = require("../../lib/agency/util/responseUtilities");
var teamFunctions = require("../team/teamFunctions");
var teamMsg = require("./teamMsg");

module.exports.teamInfo = function (req, res) {
    TeamModel.find().exec(function (err, content) {
        responseUtilities.sendJSON(res, err, content);
    });
};

module.exports.getTeamMemberImagesAllFields = function (req, res) {
    TeamMemberImageModel.find().exec(function (err, content) {
        console.log(content);
        responseUtilities.sendJSON(res, err, content );
    });
};

module.exports.getTeamMemberImages = function (req, res) {
    TeamMemberImageModel.find().exec(function (err, content) {
        console.log(content);
        var users = {};
        for (let index = 0; index < content.length; index++) {
            const user = content[index];
            users[user.email] = user.cloudImage;
        }
        responseUtilities.sendJSON(res, err, { "teamMemberImages": users });
    });
};

module.exports.getImage = function (req, res) {

    var query = { "email": req.params.email };
    TeamMemberImageModel.findOne(query).exec(function (err, result) {
        var data = { "message": teamMsg.teamMemberImageItemNotFound };
        if (!result) {
            result = data;
        }
        responseUtilities.sendJSON(res, err, result);
    });

}

module.exports.title = function (req, res) {
    TeamModel.find().select("title").exec(function (err, content) {
        responseUtilities.sendJSON(res, err, content);
    });
};

module.exports.headline = function (req, res) {
    TeamModel.find().select("headline").exec(function (err, content) {
        responseUtilities.sendJSON(res, err, content);
    });
};

module.exports.description = function (req, res) {
    TeamModel.find().select("description").exec(function (err, content) {
        responseUtilities.sendJSON(res, err, content);
    });
};

module.exports.members = function (req, res) {
    TeamModel.find().select("members").exec(function (err, content) {
        responseUtilities.sendJSON(res, err, {
            "team": content
        });
    });
};

module.exports.getTeamMember = function (req, res) {

    var email = req.params.email;
    var query = { "members.email": email };
    TeamModel
        .find(query, { 'members.$': 1 })
        .exec(function (err, content) {
            if (content.length === 0)
                content = { "message": teamMsg.teamMemberNotFound };
            responseUtilities.sendJSON(res, err, content);
        });
};

module.exports.removeMember = async function (req, res) {

    const email = req.params.email;
    let message = '';

    try {
        teamFunctions.removeMember(email)
            .then(() => {
                // first block: deleting an entry in team model. This entry is an array item.
                message += teamMsg.teamMemberRemoveSuccess;
                console.log(message);
                return teamFunctions.deleteImageMember(email);
            })
            .then(() => {
                // deleteImageMember from the previous block has worked. So, concatenate msg and return it
                message += teamMsg.teamMemberImageRemoveSuccess;
                console.log(message);
                responseUtilities.sendJSON(res, false, { "message": message , "error" : "false" });
            })
            .catch(err => {
                // if message variable is empty, the first block threw the error
                message += message.length ? teamMsg.teamMemberImageRemoveError : teamMsg.teamMemberRemoveError;
                console.log(message);
                responseUtilities.sendJSON(res, err, { "message": message, "error": "true" });
            });
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJSON(res, err, { "message": err.message, "error": "true" });
    }
};

module.exports.addTeamMember = function (req, res) {

    var email = req.body.email;
    var query = { "members.email": email };
    // checks if there is already a email
    TeamModel
        .find(query, { 'members.$': 1 })
        .exec(function (err, content) {
            if (content.length > 0 && content[0].members[0].email.length > 0) {
                responseUtilities.sendJSON(res, err, { "message": teamMsg.teamMemberEmailInUseError }, 409);
            } else {
                // gets the teaminfo
                TeamModel.find(TeamModel).exec(
                    function (err, teamInfo) {
                        if (err) {
                            responseUtilities.sendJSON(res, err, teamInfo);
                        } else {

                            teamInfo[0].members.push({
                                email: req.body.email,
                                name: req.body.name,
                                role: req.body.role,
                                twitter: req.body.twitter,
                                facebook: req.body.facebook,
                                linkedin: req.body.linkedin
                            });

                            var doc = {
                                id: teamInfo[0].description.id
                            };
                            var update = {
                                $set: {
                                    description: teamInfo[0].description,
                                    headline: teamInfo[0].headline,
                                    title: teamInfo[0].title,
                                    members: teamInfo[0].members,
                                }
                            };

                            //includes the new member
                            TeamModel.updateOne(doc, update, function (err) {
                                var message = teamMsg.teamMemberCreatedSuccess;
                                responseUtilities.sendJSON(res, err, { "message": message });
                            })
                        };
                    }
                );
            }
        });

};

module.exports.teamMemberUpdate = async function (req, res) {

    const { email, name, role, twitter, facebook, linkedin } = req.body;
    const query = { "members.email": email };
    const options = { new: true, useFindAndModify : false };
    const update = {
        $set: {
            "members.$.email": email,
            "members.$.name": name,
            "members.$.role": role,
            "members.$.twitter": twitter,
            "members.$.facebook": facebook,
            "members.$.linkedin": linkedin
        }
    };

    try {
        const result = await TeamModel.findOneAndUpdate(query, update, options);
        var message = teamMsg.teamMemberUpdatedSuccess;
        if (!result) {
            message = teamMsg.teamMemberNotFound
        }
        responseUtilities.sendJSON(res, false, { "message": message });
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJSON(res, err, { "message": err.message });
    }
};

module.exports.teamInfoUpdate = function (req, res) {

    const { id, description, headline, title } = req.body;
    
    TeamModel.find().exec(function (err, content) {

        var query = {
            id: content[0].description.id
        };
        
        var update = {
            $set: {
                description: description,
                headline: headline,
                title: title
            }
        };

        TeamModel.updateOne(query, update, function (err, result) {

            var message = teamMsg.teamItemInfoUpdatedSuccess;
            if (!result) {
                message = teamMsg.teamItemInfoUpdatedError;
            }
            responseUtilities.sendJSON(res, err, { "message": message });

        });

    });
}

module.exports.addImage = function (req, res) {

    const email = req.body.email;
    const imageName = req.body.imageName;
    let message = '';
    let cloudImage = req.files[0].path;
    let cloudImageFound = '';
    let deleteCurrentFile = false;
    let newcloudImageURL;

    try {
        teamFunctions.findTeamMember(email)
            .then(teamMember => {
                if (teamMember) {
                    console.log("AddImage: Team member found.");
                    return teamFunctions.findImageMember(imageName);
                } else {
                    throw new Error('Error: team member not found.');
                }
            })
            .then(teamMemberImage => {
                if (teamMemberImage.length >= 1) {
                    console.log("AddImage: Image for this member was found.");
                    deleteCurrentFile = true;
                    cloudImageFound = teamMemberImage[0].cloudImage;
                } else {
                    console.log("AddImage: Image for this member not found.");
                }
                return teamFunctions.uploadImage(cloudImage);
            })
            .then(cloudinaryResults => {
                console.log("AddImage: Image uploaded to Cloudinary");
                newcloudImageURL = cloudinaryResults.url;
                var imageDetails = {
                    email: email,
                    imageName: imageName,
                    cloudImage: cloudinaryResults.url,
                    imageId: cloudinaryResults.id
                }
                if (deleteCurrentFile) {
                    teamFunctions.deleteTeamMemberImageByURL(cloudImageFound).then((result) => {
                        console.log("AddImage: Old image record for the current member has been deleted.");
                        return teamFunctions.createImage(imageDetails);
                    });
                }
                else {
                    return teamFunctions.createImage(imageDetails);
                }
            })
            .then(() => {
                console.log("AddImage: Image record for the current member has been created.");
                var message = teamMsg.teamImageMemberUploadingSuccess;
                responseUtilities.sendJSON(res, false, { "message": message, "cloudImage" : newcloudImageURL, "error" : "false" });
            })
            .catch(err => {
                // if message variable is empty, the first block threw the error
                message += teamMsg.teamImageMemberUploadingError;
                console.log(message);
                responseUtilities.sendJSON(res, err, { "message": message, "error": "true" });
            });
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJSON(res, err, { "message": err.message, "error": "true" });
    }

}
