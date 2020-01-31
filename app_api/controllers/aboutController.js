var mongoose = require('mongoose');
var AboutModel = mongoose.model('about');
var responseUtilities = require("../lib/agency/util/responseUtilities");


module.exports.aboutListing = function (req, res) {
    AboutModel.find().sort({date: 'ascending'}).exec(function (err, content) {

        responseUtilities.sendJsonResponse(res, err, { "abouts": content });
    });
};

module.exports.save = function (req, res) {
    AboutModel.create({
        date: req.body.date,
        headline: req.body.headline,
        description: req.body.description
    }, function (err, result) {
            var message = "About item has been created successful.";
            if (!result) {
                message = "Error at creating an about item.";
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });
    });
};

module.exports.getAboutItem = function (req, res) {

    var valid = mongoose.Types.ObjectId.isValid(req.params.idAboutItem);
    if (valid) {
        var query = { "_id": req.params.idAboutItem };
        AboutModel.findById(query).exec(function (err, result) {
            var data = { "message": "About item not found." };
            if (!result) {
                result = data;
            }
            responseUtilities.sendJsonResponse(res, err, result);
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": "About item id is not valid." });
    }
};

module.exports.delete = function (req, res) {

    var id = req.body.id;
    var valid = mongoose.Types.ObjectId.isValid(id);

    if (valid) {
        AboutModel
        .findByIdAndDelete({"_id": id})
        .exec(function (err, result) {
            var message = "About item has been removed successful.";
            if (!result) {
                message = "Error at deleting an about item.";
            }

            responseUtilities.sendJsonResponse(res, err, {"message": message});

        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": "About item id is not valid." });
    }


};

module.exports.update = function (req, res) {

    var id = req.body.id;
    var valid = mongoose.Types.ObjectId.isValid(id);

    if (valid) {
        var query = { _id: req.body.id };
        var options = { new: true };
        var update = {
            "$set": {
                "date": req.body.date,
                "headline": req.body.headline,
                "description": req.body.description,
            }
        };

        AboutModel.findByIdAndUpdate(query, update, options, function (err, result) {
            var message = "About item has been updated successful.";
            if (!result) {
                message = "Error at updating an about item.";
            }

            responseUtilities.sendJsonResponse(res, err, { "message": message });
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": "About item id is not valid." });
    }

};