var mongoose = require('mongoose');
var AboutModel = mongoose.model('about');
var AboutImageModel = mongoose.model('aboutImage');

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
    }

}

module.exports = aboutFunctions;