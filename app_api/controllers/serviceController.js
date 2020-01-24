var mongoose = require('mongoose');
var ServiceModel = mongoose.model('service');
var responseUtilities = require("../lib/agency/util/responseUtilities");

module.exports.delete = function (req, res) {

    var id = req.body.id;

    ServiceModel
        .findByIdAndDelete({"_id": id})
        .exec(function (err, result) {
            var message = "Service has been removed successful.";
            if (!result) {
                message = "Error at deleting service.";
            }
            
            responseUtilities.sendJsonResponse(res, err, {"message": message});

        });
};

module.exports.update = function (req, res) {

    var query = { _id: req.body.id };
    var options = { new: true };
    var update = {
        "$set": {
            "description": req.body.description,
            "title": req.body.title
        }
    };

    ServiceModel.findByIdAndUpdate(query, update, options, function (err, result) {
        var message = "Service has been updated successful.";
        if (!result) {
            message = "Error at updating service.";
        }

        responseUtilities.sendJsonResponse(res, err, { "message": message });
    });


};

module.exports.getService = function (req, res) {
    
    var valid = mongoose.Types.ObjectId.isValid(req.params.idService);
    if (valid) {
        var query = { "_id": req.params.idService };
        ServiceModel.findById(query).exec(function (err, result) {
            var data = { "message": "Service not found." };
            if (!result) {
                result = data;
            }
            responseUtilities.sendJsonResponse(res, err, result);
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": "Service id is not valid." });
    }
    

};

module.exports.serviceListing = function (req, res) {
    ServiceModel.find().exec(function (err, content) {
        responseUtilities.sendJsonResponse(res, err, { "services": content });
    });
};

module.exports.save = function (req, res) {
    ServiceModel.create({
        title: req.body.title,
        description: req.body.description
    }, function (err, result) {
            var message = "Service has been created successful.";
            if (!result) {
                message = "Error at creating the service.";
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });
    });
};