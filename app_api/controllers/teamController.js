var mongoose = require('mongoose');
var TeamModel = mongoose.model('team');

var sendJsonResponse = function (res, err, content) {
    httpStatus = 200;
    if (err) {
        content = err;
        httpStatus = 404;
    } 
    
    console.log("Result: " + content);
    res.status(httpStatus);
    res.json(content);
};

module.exports.teamListing = function (req, res) {
    TeamModel.find().exec(function (err, content) {
        sendJsonResponse(res, err, content);
    });
};

module.exports.getTeamMember = function (req, res) {

    TeamModel
        .find({ "team.email": req.params.email }, {'team.$': 1})
        .exec(function (err, content) {
               sendJsonResponse(res, err, content);
        });
};