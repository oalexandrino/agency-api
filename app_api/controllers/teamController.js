var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

module.exports.teamListing = function (req, res) {
    TeamModel.find().exec(function(err, arrTeamListing) {
        sendJsonResponse(res, 200, arrTeamListing);
    });
};

module.exports.getTeamMember = function (req, res) {
    console.log(req.params.email);
    TeamModel.find({"team": {email:  req.params.email}  }).exec(function(err, team) {
        if (!team) {
            sendJsonResponse(res, 404, {"message": "team member information is not found"});
            return;
        } else if (err) {
            console.log(err);
            sendJsonResponse(res, 404, err);
            return;
        }
        console.log(team);
        sendJsonResponse(res, 200, team);
      });
};