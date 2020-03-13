var mongoose = require('mongoose');

var teamMemberModelSchema = new mongoose.Schema({
     _id: false,
    "email": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 50
    },
    "name": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 256
    },
    "role": {
        "type": String,
        "required": true,
        "min": 20,
        "max": 256
    },
    "twitter": {
        "type": String,
        "required": true,
        "min": 1,
        "max": 100
    },
    "facebook": {
        "type": String,
        "required": true,
        "min": 1,
        "max": 100
    },
    "linkedin": {
        "type": String,
        "required": true,
        "min": 1,
        "max": 100
    },
});

var teamModelSchema = new mongoose.Schema({
    "title": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 20
    },
    "headline": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 30
    },
    "description": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 80
    },
    "members": [teamMemberModelSchema]
}, { collection: 'team' });

teamModelSchema.set('collection', 'team');
mongoose.model('team', teamModelSchema)
