var mongoose = require('mongoose');
var ServiceModel = mongoose.model('service');
var responseUtilities = require("../lib/agency/util/responseUtilities");

module.exports.delete = function (req, res) {
    
    var id = req.body.id;

    ServiceModel
        .findByIdAndDelete({ "_id": id })
        .exec(function (err, result) {
            
            responseUtilities.sendJsonResponse(res, err, { "message": "Service has been removed successful." });
            
        });
};

module.exports.update = function (req, res) {
    
};

module.exports.getService = function (req, res) {
    
    ServiceModel.findById(req.params.idService).exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.serviceListing = function (req, res) {
    ServiceModel.find().exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};

module.exports.save = function (req, res) {
    ServiceModel.create({
        title: req.body.title,
        description: req.body.description
    }, function (err, content) {
        responseUtilities.sendJsonResponse(res, err, content);
    });
};