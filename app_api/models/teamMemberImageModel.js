var mongoose = require('mongoose');

var teamMemberImageModel = new mongoose.Schema({
    "email": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 20
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

teamMemberImageModel.set('collection', 'teamMemberImage');
mongoose.model('teamMemberImage', teamMemberImageModel);
