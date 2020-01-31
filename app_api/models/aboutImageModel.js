var mongoose = require('mongoose');

var aboutImageModel = new mongoose.Schema({
    "aboutId": {
        "type": String,
        "required": true
    },
    "imageName": {
        "type": String,
        "required": true
    },
    "cloudImage": {
        "type": String,
        "required": true
    },
    "imageId": {
        "type": String
    },
    "post_date": {
        "type": Date,
        "default": Date.now
    }
})

aboutImageModel.set('collection', 'aboutImage');
mongoose.model('aboutImage', aboutImageModel);
