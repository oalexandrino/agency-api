var mongoose = require('mongoose');
var AboutModel = mongoose.model('about');
var responseUtilities = require("../lib/agency/util/responseUtilities");


module.exports.aboutListing = function (req, res) {
    AboutModel.find().exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, { "abouts": content });
    });
};