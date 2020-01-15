var mongoose = require('mongoose');

var teamMemberModelSchema = new mongoose.Schema({
    "name": {
        "type": String,
        "required": true,
        "min": 5,
        "max": 20
    },
    "role": {
        "type": String,
        "required": true,
        "min": 20,
        "max": 50
    },
    "twitter": {
        "type": String,
        "required": true,
        "min": 20,
        "max": 50
    },
    "facebook": {
        "type": String,
        "required": true,
        "min": 20,
        "max": 50
    },
    "linkedin": {
        "type": String,
        "required": true,
        "min": 20,
        "max": 50
    },
    "image": {
        "data": Buffer,
        "contentType": String
    }
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
    "team": [teamMemberModelSchema]
});

mongoose.model('Team', teamModelSchema);