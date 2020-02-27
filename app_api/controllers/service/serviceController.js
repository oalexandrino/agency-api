/*
MIT License

Copyright (c) 2020 Olavo Alexandrino, http://www.oalexandrino.com.br

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var mongoose = require('mongoose');
var ServiceModel = mongoose.model('service');
var responseUtilities = require("../../lib/agency/util/responseUtilities");
var serviceMsg = require("./serviceMsg");

module.exports.delete = function (req, res) {
    var id = req.params.idService;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if (valid) {
        ServiceModel
            .findByIdAndDelete({ "_id": id })
            .exec(function (err, result) {
                var message = serviceMsg.serviceItemRemoveSuccess;

                if (!result) {
                    message = serviceMsg.serviceItemRemoveError;
                }
                responseUtilities.sendJsonResponse(res, err, { "message": message });
            });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": serviceMsg.idNotValidError });
    }
};

module.exports.update = function (req, res) {

    var id = req.body.id;
    var valid = mongoose.Types.ObjectId.isValid(id);
    if (valid) {
        var query = { _id: id };
        var options = { new: true };
        var update = {
            "$set": {
                "description": req.body.description,
                "title": req.body.title,
                "fontawesomeIcon": req.body.fontawesomeIcon
            }
        };

        ServiceModel.findByIdAndUpdate(query, update, options, function (err, result) {
            var message = serviceMsg.serviceItemUpdatedSuccess;
            if (!result) {
                message = serviceMsg.serviceItemUpdatedError;
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });
        });

    }
    else {
        responseUtilities.sendJsonResponse(res, false, { "message": serviceMsg.idNotValidError });
    }

};

module.exports.getService = function (req, res) {

    var valid = mongoose.Types.ObjectId.isValid(req.params.idService);
    if (valid) {
        var query = { "_id": req.params.idService };
        ServiceModel.findById(query).exec(function (err, result) {
            var data = { "message": serviceMsg.serviceItemNotFound };
            if (!result) {
                result = data;
            }
            responseUtilities.sendJsonResponse(res, err, result);
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": serviceMsg.idNotValidError });
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
        description: req.body.description,
        fontawesomeIcon: req.body.fontawesomeIcon
    }, function (err, result) {
            var message = serviceMsg.serviceItemCreatedSuccess;
            if (!result) {
                message = serviceMsg.serviceItemCreatedError;
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });
    });

};
