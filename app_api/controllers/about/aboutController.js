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
var AboutModel = mongoose.model('about');
var AboutImageModel = mongoose.model('aboutImage');
var CloudinarySettings = require('../../lib/agency/upload/CloudinarySettings');
var responseUtilities = require("../../lib/agency/util/responseUtilities");
var aboutFunctions = require("../about/aboutFunctions");
var aboutMsg = require("./aboutMsg");

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
            var message = aboutMsg.aboutItemCreatedSuccess;
            if (!result) {
                message = aboutMsg.aboutItemCreatedError;
            }
            responseUtilities.sendJsonResponse(res, err, { "message": message });
    });
};

module.exports.getAboutItem = function (req, res) {

    var valid = mongoose.Types.ObjectId.isValid(req.params.idAboutItem);
    if (valid) {
        var query = { "_id": req.params.idAboutItem };
        AboutModel.findById(query).exec(function (err, result) {
            var data = { "message": aboutMsg.aboutItemNotFound };
            if (!result) {
                result = data;
            }
            responseUtilities.sendJsonResponse(res, err, result);
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.idNotValidError });
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
            var message = aboutMsg.aboutItemUpdatedSuccess;
            if (!result) {
                message = aboutMsg.aboutItemUpdatedError;
            }

            responseUtilities.sendJsonResponse(res, err, { "message": message });
        });
    } else {
        responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.idNotValidError });
    }

};

module.exports.addImage = function (req, res) {

    try {
        console.log(req.headers);
        var aboutId = req.body.aboutId;
        var valid = mongoose.Types.ObjectId.isValid(aboutId);
        if (valid) {
            AboutModel
            .findById({
                "_id": aboutId
            })
            .exec(function (err, content) {

                if (content.length === 0 ) {
                    responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.aboutItemNotFound });
                    return;
                }
                else {

                    var imageDetails = {
                        imageName: req.body.imageName,
                    }

                    if (!req.files) {
                        responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.aboutImageItemNoFileProvidedError });
                        return;
                    }

                    // check if image-name exist
                    AboutImageModel.find({
                        imageName: imageDetails.imageName
                    }, (err, callback) => {

                        //checking if error occurred
                        if (err) {
                            responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.aboutImageItemUploadError });
                        } else if (callback.length >= 1) {
                            responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.aboutImageItemFileAlreadyExistError });
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

                                    var message = aboutMsg.aboutImageItemUploadSuccess;
                                    if (err) {
                                        message = `${aboutMsg.aboutImageItemUploadError} ${aboutMsg.aboutErrorDescription}  ${err}`;
                                        responseUtilities.sendJsonResponse(res, false, {
                                            "message": message
                                        });
                                    }
                                    else {
                                      responseUtilities.sendJsonResponse(res, false, {
                                          "message": message , "aboutId" : aboutId, "cloudImage" : result.url
                                      });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        } else {
            responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.idNotValidError });
        }
    } catch (err) {
        console.log(err.message);
        responseUtilities.sendJsonResponse(res, false, { "message": err.message });
    }
}

module.exports.getImage = function (req, res) {

  var valid = mongoose.Types.ObjectId.isValid(req.params.idAboutItem);
  if (valid) {
      var query = { "aboutId": req.params.idAboutItem };
      AboutImageModel.findOne(query).exec(function (err, result) {
          var data = { "message": aboutMsg.aboutImageItemNotFound };
          if (!result) {
              result = data;
          }
          responseUtilities.sendJsonResponse(res, err, result);
      });
  } else {
      responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.idNotValidError });
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

module.exports.delete = function (req, res) {

    const idAbout = req.params.idAbout;

    if (!mongoose.Types.ObjectId.isValid(idAbout)) {
        responseUtilities.sendJsonResponse(res, false, { "message": aboutMsg.idNotValidError });
    }
    else {

        let message = '';

        try {
            aboutFunctions.deleteAboutWithId(idAbout)
            .then(() => {
                // deleteAboutWithId worked
                message += aboutMsg.aboutItemRemoveSuccess;
                console.log(message);
                return aboutFunctions.deleteImageWithAboutId(idAbout); })
            .then(() => {
                // deleteImageWithAboutId worked
                message += aboutMsg.aboutImageItemRemoveSuccess;
                console.log(message);
                responseUtilities.sendJsonResponse(res, false, { "message": message }); })
            .catch(err => {
                // if message is empty, the first block threw the error
                message += message.length ? aboutMsg.aboutImageItemRemoveError : aboutMsg.aboutItemRemoveError;
                console.log(message);
                responseUtilities.sendJsonResponse(res, err, { "message": message });
            });
        } catch (err) {
            console.log(err.message);
            responseUtilities.sendJsonResponse(res, err, { "message": err.message });
        }
    }
}
