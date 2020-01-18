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

    TeamModel
        .find({ "team.email": req.params.email }, {'team.$': 1})
        .exec(function (err, team) {
            loginfo = team;
            if (err) {
                loginfo = err;
                sendJsonResponse(res, 404, err); 
            } 
            console.log(loginfo);
            sendJsonResponse(res, 200, team);
        });
};