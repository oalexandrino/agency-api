var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');

var sendJsonResponse = function (res, err, content) {
    var httpStatus = 200;
    if (err) {
        content = err;
        httpStatus = 404;
    }

    console.log("Result: " + content);
    res.status(httpStatus);
    res.json(content);
}

module.exports.teamInfo = function (req, res ) {
    TeamModel.find().exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};
 
module.exports.title = function (req, res) {
    TeamModel.find().select("title").exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};

module.exports.headline = function (req, res) {
    TeamModel.find().select("headline").exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};

module.exports.description = function (req, res) {
    TeamModel.find().select("description").exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};

module.exports.team = function (req, res) {
    TeamModel.find().select("team").exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};

module.exports.getTeamMember = function (req, res) {

    TeamModel
        .find({ "team.email": req.params.email }, { 'team.$': 1 })
        .exec(function (err, content) {
            sendJsonResponse(res, err, content);
        });
};