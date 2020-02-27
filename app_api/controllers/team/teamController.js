var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');
var TeamImageModel = mongoose.model('teamMemberImage');
var CloudinarySettings = require('../../lib/agency/upload/CloudinarySettings');
var responseUtilities = require("../../lib/agency/util/responseUtilities");
var teamMsg = require("./teamMsg");

module.exports.teamInfo = function (req, res) {
    TeamModel.find().exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.getTeamMemberImages = function (req, res) {
    TeamImageModel.find().exec(function (err, content) {
        var users = {};
        for (let index = 0; index < content.length; index++) {
            const user = content[index];
            users[user.email] = user.cloudImage;
        }
        responseUtilities.sendJsonResponse(res, err, { "teamMemberImages": users}  );
    });
};

module.exports.title = function (req, res) {
    TeamModel.find().select("title").exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.headline = function (req, res) {
    TeamModel.find().select("headline").exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.description = function (req, res) {
    TeamModel.find().select("description").exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.members = function (req, res) {
    TeamModel.find().select("members").exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, {
            "team": content
        });
    });
};

module.exports.getTeamMember = function (req, res) {

    var email = req.params.email;
    var query = {"members.email": email };
    TeamModel
        .find( query , { 'members.$': 1} )
        .exec(function (err, content) {
            if (content.length === 0)
                content = {"message": teamMsg.teamMemberNotFound };
            responseUtilities.sendJsonResponse(res, err, content);
        });
};

module.exports.removeMember = function (req, res) {
    var email = req.body.email;
    var query = {"members.email": email };
    TeamModel
        .find( query, {'members.$': 1})
        .exec(function (err, result) {
            if (result.length > 0 && typeof result[0].members[0].email === 'string') {
                var foundEmail = result[0].members[0].email;
                var foundId = result[0].members[0].id;

                TeamModel.findOne( query, function (err, result2) {
                    result2.members.id(foundId).remove();
                    result2.save().then(
                        responseUtilities.sendJsonResponse(res, err, { "message": teamMsg.teamMemberRemoveSuccess })
                    );
                });
            } else {
                responseUtilities.sendJsonResponse(res, err, { "message": teamMsg.teamMemberRemoveError }, 404);
            }
        });
};

module.exports.addTeamMember = function (req, res) {

    var email = req.body.email;
    var query = {"members.email": email };
    // checks if there is already a email
    TeamModel
        .find( query, { 'members.$': 1})
        .exec(function (err, content) {
            if (content.length > 0 && content[0].members[0].email.length >0 ) {
                responseUtilities.sendJsonResponse(res, err, { "message": teamMsg.teamMemberEmailInUseError }, 409);
            } else {
                // gets the teaminfo
                TeamModel.find(TeamModel).exec(
                    function (err, teamInfo) {
                        if (err) {
                            responseUtilities.sendJsonResponse(res, err, teamInfo);
                        } else {

                            const email = req.body.email;

                            teamInfo[0].members.push({
                                email: req.body.email,
                                name: req.body.name,
                                role: req.body.role,
                                twitter: req.body.twitter,
                                facebook: req.body.facebook,
                                linkedin: req.body.linkedin
                            });

                            var membersLength = teamInfo[0].members.length - 1;
                            var thisMember;
                            thisMember = teamInfo[0].members[membersLength];

                            var doc = {
                                id: teamInfo[0].description.id
                            };
                            var options = {
                                $set: {
                                    id: teamInfo[0].id,
                                    description: teamInfo[0].description,
                                    headline: teamInfo[0].headline,
                                    title: teamInfo[0].title,
                                    members: teamInfo[0].members,
                                }
                            };

                            //includes the new member
                            TeamModel.updateOne(doc, options, function (err, result) {
                                var message = teamMsg.teamMemberCreatedSuccess;
                                responseUtilities.sendJsonResponse(res, err, { "message": message });
                            })
                        };
                    }
                );
            }
        });

};

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
            responseUtilities.sendJsonResponse(res, err, { "message": message});

        });

    });
}

module.exports.addImage = function (req, res) {

    var email = req.body.email;
    var query = { "members.email": email };

    try {

        TeamModel
            .find( query, { 'members.$': 1})
            .exec(function (err, content) {

                if (content.length === 0 ) {
                    responseUtilities.sendJsonResponse(res, false, { "message": teamMsg.teamImageMemberUpdatedError });
                    return;
                }
                else {

                    var imageDetails = {
                        imageName: req.body.imageName,
                    }

                    if (!req.files) {
                        responseUtilities.sendJsonResponse(res, false, { "message": teamMsg.teamImageMemberNoDataError });
                        return;
                    }

                    // check if image-name exist
                    TeamImageModel.find({
                        imageName: imageDetails.imageName
                    }, (err, callback) => {

                        //checking if error occurred
                        if (err) {

                            responseUtilities.sendJsonResponse(res, false, { "message": teamMsg.teamItemImageUploadingError });

                        } else if (callback.length >= 1) {

                            responseUtilities.sendJsonResponse(res, false, { "message": teamMsg.teamImageMemberFileExistError });

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
                                TeamImageModel.create(imageDetails, (err, created) => {
                                    var message = teamMsg.teamImageMemberUploadingSuccess;
                                    if (err) {
                                        message = `${teamMsg.teamImageMemberUploadingError} ${err}`;
                                    }
                                    responseUtilities.sendJsonResponse(res, false, { "message": message });
                                });
                            });
                        }
                    });
                }
            });
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJsonResponse(res, false, { "message": err.message });
    }
}