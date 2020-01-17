var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

module.exports.teamListing = function (req, res) {
    TeamModel
    .find({})
    .exec(function(err, arrTeamListing) {
        sendJsonResponse(res, 200, arrTeamListing);
    });
};

module.exports.getTeamMember = function (req, res) {
    res.status(200);
    res.json({ "status": "success" });
};