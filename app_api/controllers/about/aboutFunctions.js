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

var aboutFunctions =  {

    deleteAboutWithId : function (id) {

        return new Promise((resolve, reject) => {

            AboutModel.findByIdAndDelete({ "_id": id }).exec(function (err, result) {
                err ? reject(err) : resolve(result)
            });

        });

    },
    deleteImageWithAboutId : function (id) {

        return new Promise((resolve, reject) => {

            AboutImageModel.findOneAndDelete({ aboutId: id }).exec(function (err, result) {
                err ? reject(err) : resolve(result)
            });

        });
    },
    findImage: function (imageName) {
        return new Promise((resolve, reject) => {
            let imageQuery = { imageName: imageName };
            AboutImageModel.find(imageQuery, (err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    },
    createImage(imageDetails) {
        return new Promise((resolve, reject) => {
            AboutImageModel.create(imageDetails, (err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    },
    upload(cloudImage) {
        return new Promise((resolve, reject) => {
            CloudinarySettings.uploads(cloudImage).then((result) => {
                resolve(result);
            });
        });
    },
    deleteImageByURL(URL) {
        return new Promise((resolve, reject) => {
            let imageQuery = { cloudImage: URL };
            AboutImageModel.findOneAndDelete(imageQuery).exec(function (err, result) {
                err ? reject(err) : resolve(result)
            });
        });
    },
    
}

module.exports = aboutFunctions;