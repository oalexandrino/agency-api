var mongoose = require('mongoose');
var AboutModel = mongoose.model('about');
var AboutImageModel = mongoose.model('aboutImage');
var CloudinarySettings = require('../lib/agency/upload/CloudinarySettings');
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
        responseUtilities.sendJsonResponse(res, false, { "message": "Error retrieving an item. About item id is not valid." });
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

module.exports.addImage = function (req, res) {

    try {

        var aboutId = req.body.aboutId;
        var valid = mongoose.Types.ObjectId.isValid(aboutId);

        if (valid) {
            AboutModel
            .findById({
                "_id": aboutId
            })
            .exec(function (err, content) {

                if (content.length === 0 ) {
                    responseUtilities.sendJsonResponse(res, false, { "message": 'Image has not been added. No item found with the provided id.' });
                    return;
                }
                else {

                    var imageDetails = {
                        imageName: req.body.imageName,
                    }

                    if (!req.files) {
                        responseUtilities.sendJsonResponse(res, false, { "message": 'Please provide data.' });
                        return;
                    }

                    // check if image-name exist
                    AboutImageModel.find({
                        imageName: imageDetails.imageName
                    }, (err, callback) => {

                        //checking if error occurred
                        if (err) {

                            responseUtilities.sendJsonResponse(res, false, { "message": 'There was a problem uploading image.' });

                        } else if (callback.length >= 1) {

                            responseUtilities.sendJsonResponse(res, false, { "message": 'Image has not been added. File already exist.' });

                        } else {

                            var imageDetails = {
                                imageName: req.body.imageName,
                                cloudImage: req.files[0].path,
                                imageId: ''
                            }

                            // if all things went well, to post the image to cloudinary
                            CloudinarySettings.uploads(imageDetails.cloudImage).then((result) => {

                                var imageDetails = {
                                    aboutId: aboutId,
                                    imageName: req.body.imageName,
                                    cloudImage: result.url,
                                    imageId: result.id
                                }

                                // then create the image file in the database
                                AboutImageModel.create(imageDetails, (err, created) => {

                                    var message = "Image uploaded successfully for the provided about item!!"

                                    if (err) {

                                        message = "It could not upload image, try again. Error description: " + err;

                                    }

                                    responseUtilities.sendJsonResponse(res, false, {
                                        "message": message
                                    });

                                });
                            });
                        }
                    });
                }
            });
        } else {
            responseUtilities.sendJsonResponse(res, false, { "message": "About item id is not valid." });
        }


    } catch (execptions) {
        console.log(execptions);
        responseUtilities.sendJsonResponse(res, false, { "message": execptions });
    }
}

module.exports.getAboutImages = function (req, res) {
    AboutImageModel.find().exec(function (err, content) {

        var abouts = {};

        for (let index = 0; index < content.length; index++) {
            const aboutItem = content[index];
            abouts[aboutItem.aboutId] = aboutItem.cloudImage;

        }

        responseUtilities.sendJsonResponse(res, err, { "aboutImages": abouts}  );
    });
};