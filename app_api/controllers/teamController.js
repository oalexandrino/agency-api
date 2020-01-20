var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');
//var TeamMember = mongoose.model('member');
var responseUtilities = require("../lib/agency/util/responseUtilities");

module.exports.teamInfo = function (req, res ) {
    TeamModel.find().exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
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
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.getTeamMember = function (req, res) {

    TeamModel
        .find({ "members.email": req.params.email }, { 'members.$': 1 })
        .exec(function (err, content) {
            responseUtilities.sendJsonResponse(res, err, content);
        });
};

module.exports.addTeamMember = function (req, res) {

    TeamModel.find( TeamModel ).exec(
        function (err, teamInfo) {
            if (err) {
                responseUtilities.sendJsonResponse(res, err, teamInfo);
            } else {

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

                var doc  = { id: teamInfo[0].description.id };
                var options = { $set: { id: teamInfo[0].id,
                                        description: teamInfo[0].description,
                                        headline: teamInfo[0].headline,
                                        title: teamInfo[0].title,
                                        members: teamInfo[0].members,
                                        }};

                 TeamModel.updateOne(doc, options,function (err, teamInfo) {
                    if (err) {
                        data = teamInfo;
                    }
                    else {
                        data = thisMember;
                    }
                    responseUtilities.sendJsonResponse(res, err, data);
                 }
                )};
            }
        );
};