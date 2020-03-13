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
var TeamImageModel = mongoose.model('teamMemberImage');
var CloudinarySettings = require('../../lib/agency/upload/CloudinarySettings');
var responseUtilities = require("../../lib/agency/util/responseUtilities");
var teamFunctions = require("../team/teamFunctions");
var teamMsg = require("./teamMsg");

module.exports.teamInfo = function (req, res) {
    TeamModel.find().exec(function (err, content) {
        responseUtilities.sendJSON(res, err, content);
    });
};

module.exports.getTeamMemberImages = function (req, res) {
    TeamImageModel.find().exec(function (err, content) {
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
    TeamImageModel.findOne(query).exec(function (err, result) {
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

module.exports.removeMember = function (req, res) {
    var email = req.body.email;
    var query = { "members.email": email };
    TeamModel
        .find(query, { 'members.$': 1 })
        .exec(function (err, result) {
            if (result.length > 0 && typeof result[0].members[0].email === 'string') {
                var foundId = result[0].members[0].id;

                TeamModel.findOne(query, function (err, result2) {
                    result2.members.id(foundId).remove();
                    result2.save().then(
                        responseUtilities.sendJSON(res, err, { "message": teamMsg.teamMemberRemoveSuccess })
                    );
                });
            } else {
                responseUtilities.sendJSON(res, err, { "message": teamMsg.teamMemberRemoveError }, 404);
            }
        });
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

module.exports.teamMemberUpdate = function (req, res) {

    var email = req.body.email;
    var name = req.body.name;
    var role = req.body.role;
    var twitter = req.body.twitter;
    var facebook = req.body.facebook;
    var linkedin = req.body.linkedin;

    teamFunctions.findTeamMember(email)
        .then(data => {

            if (data.length === 0) {
                responseUtilities.sendJSON(res, false, { "message": teamMsg.teamMemberNotFound });
            }
            else {
                return data[0];
            }

        })
        .then(data => {

            const query = { "members.email": email };
            const options = { new: true };
            var update = {
                $set: {
                    email: email,
                    name: name,
                    role: role,
                    twitter: twitter,
                    facebook: facebook,
                    linkedin: linkedin
                }
            };

            var id = mongoose.Types.ObjectId('5e25db5c03bf600017c41abb');
            TeamModel.findByIdAndUpdate({ "members._id": id }, update, options, function (err, result) {
                var message = teamMsg.teamMemberUpdatedSuccess;
                if (!result) {
                    message = teamMsg.teamMemberUpdatedError;
                }
                responseUtilities.sendJSON(res, err, { "message": message });
            });

        })
        .catch(err => {
            console.log(err.message);
            responseUtilities.sendJSON(res, err, { "message": err.message });
        });
}

module.exports.teamInfoUpdate = function (req, res) {

    TeamModel.find().exec(function (err, content) {

        var doc = {
            id: content[0].description.id
        };
        var options = {
            $set: {
                id: content[0].id,
                description: req.body.description,
                headline: req.body.headline,
                title: req.body.title,
                members: content[0].members,
            }
        };

        TeamModel.updateOne(doc, options, function (err, result) {

            var message = teamMsg.teamItemInfoUpdatedSuccess;
            if (!result) {
                message = teamMsg.teamItemInfoUpdatedError;
            }
            responseUtilities.sendJSON(res, err, { "message": message });

        });

    });
}

module.exports.addImage = function (req, res) {

    var email = req.body.email;
    var query = { "members.email": email };

    try {

        TeamModel
            .find(query, { 'members.$': 1 })
            .exec(function (err, content) {

                if (content.length === 0) {
                    responseUtilities.sendJSON(res, false, { "message": teamMsg.teamImageMemberUpdatedError });
                    return;
                }
                else {

                    var imageDetails = {
                        imageName: req.body.imageName,
                    }

                    if (!req.files) {
                        responseUtilities.sendJSON(res, false, { "message": teamMsg.teamImageMemberNoDataError });
                        return;
                    }

                    // check if image-name exist
                    TeamImageModel.find({
                        imageName: imageDetails.imageName
                    }, (err, callback) => {

                        //checking if error occurred
                        if (err) {

                            responseUtilities.sendJSON(res, false, { "message": teamMsg.teamItemImageUploadingError });

                        } else if (callback.length >= 1) {

                            responseUtilities.sendJSON(res, false, { "message": teamMsg.teamImageMemberFileExistError });

                        } else {

                            var imageDetails = {
                                imageName: req.body.imageName,
                                cloudImage: req.files[0].path,
                                imageId: ''
                            }

                            // if all things went well, to post the image to cloudinary
                            CloudinarySettings.uploads(imageDetails.cloudImage).then((result) => {

                                var imageDetails = {
                                    email: req.body.email,
                                    imageName: req.body.imageName,
                                    cloudImage: result.url,
                                    imageId: result.id
                                }

                                // then create the image file in the database
                                TeamImageModel.create(imageDetails, (err) => {
                                    var message = teamMsg.teamImageMemberUploadingSuccess;
                                    if (err) {
                                        message = `${teamMsg.teamImageMemberUploadingError} ${err}`;
                                    }
                                    responseUtilities.sendJSON(res, false, { "message": message });
                                });
                            });
                        }
                    });
                }
            });
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJSON(res, false, { "message": err.message });
    }
}
