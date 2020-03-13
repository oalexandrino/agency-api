var mongoose = require('mongoose');

var teamMemberModelSchema = new mongoose.Schema({
     _id: false,
    "email": {
        "type": String,
        "required": true,
        "minlenght": 5,
        "maxheight": 50
    },
    "name": {
        "type": String,
        "required": true,
        "minlenght": 5,
        "maxheight": 256
    },
    "role": {
        "type": String,
        "required": true,
        "minlenght": 20,
        "maxheight": 256
    },
    "twitter": {
        "type": String,
        "required": true,
        "minlenght": 1,
        "maxheight": 100
    },
    "facebook": {
        "type": String,
        "required": true,
        "minlenght": 1,
        "maxheight": 100
    },
    "linkedin": {
        "type": String,
        "required": true,
        "minlenght": 1,
        "maxheight": 100
    },
});

var teamModelSchema = new mongoose.Schema({
    "title": {
        "type": String,
        "required": true,
        "minlenght": 5,
        "maxheight": 20
    },
    "headline": {
        "type": String,
        "required": true,
        "minlenght": 5,
        "maxheight": 30
    },
    "description": {
        "type": String,
        "required": true,
        "minlenght": 5,
        "maxheight": 80
    },
    "members": [teamMemberModelSchema]
}, { collection: 'team' });

teamModelSchema.set('collection', 'team');
mongoose.model('team', teamModelSchema)
