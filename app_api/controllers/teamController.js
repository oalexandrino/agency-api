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

module.exports.team = function (req, res) {
    TeamModel.find().select("team").exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.getTeamMember = function (req, res) {

    TeamModel
        .find({ "team.email": req.params.email }, { 'team.$': 1 })
        .exec(function (err, content) {
            responseUtilities.sendJsonResponse(res, err, content);
        });
};