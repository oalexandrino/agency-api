var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');
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
            if (content.length === 0)
                content = {"message": "Member not found."};
             responseUtilities.sendJsonResponse(res, err, content);
        });
};

module.exports.removeMember = function (req, res) {
    var email = req.body.email;
    TeamModel
        .find({ "members.email": email }, { 'members.$': 1 })
        .exec(function (err, result) {
            if ( result.length >0  && typeof  result[0].members[0].email === 'string' )
            {
                var foundEmail = result[0].members[0].email;
                var foundId = result[0].members[0].id;

                TeamModel.findOne({'members.email': email}, function (err, result2) {
                    result2.members.id(foundId).remove();
                    result2.save().then(
                        responseUtilities.sendJsonResponse(res, err, { "message": "Member has been removed successful" })
                    );
                });
            }
            else
            {
                responseUtilities.sendJsonResponse(res, err, { "message": "Member could not be removed. E-mail not found." }, 404);
            }
        });
};

module.exports.addTeamMember = function (req, res) {

    var email = req.body.email;
    TeamModel
        .find({ "members.email": email }, { 'members.$': 1 })
        .exec(function (err, content) {
            if ( content.length >0  && typeof content[0].members[0].email === 'string' )
            {
                responseUtilities.sendJsonResponse(res, err, { "message": "Member could not be added. E-mail provided is in use." }, 409);
            }
            else
            {

                TeamModel.find( TeamModel ).exec(
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

                            var doc  = { id: teamInfo[0].description.id };
                            var options = { $set: { id: teamInfo[0].id,
                                                    description: teamInfo[0].description,
                                                    headline: teamInfo[0].headline,
                                                    title: teamInfo[0].title,
                                                    members: teamInfo[0].members,
                                                    }};

                            console.log(req.body.email);

                            TeamModel.updateOne(doc, options, function (err, result) {
                                var message = "User has been created.";
                                responseUtilities.sendJsonResponse(res, err, { "message": message });
                             }
                            )};
                        }
                    );
            }
        });

};

module.exports.teamInfoUpdate = function (req, res) {

    TeamModel.find().exec(function (err, content) {

        var doc  = { id: content[0].description.id };
        var options = { $set: { id: content[0].id,
                                description: req.body.description,
                                headline: req.body.headline,
                                title: req.body.title,
                                members: content[0].members,
                                }};

        TeamModel.updateOne(doc, options, function (err, result) {

            var message = "Team info has been updated successful.";
            if (!result) {
                message = "Error at updating the Team info.";
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });

        });

    });
}