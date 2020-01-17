var mongoose = require('mongoose');

var aboutModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 20,
        max: 50
    },
    Date: {
        type: Date,
        "default": Date.now
    },
    image: {
        data: Buffer,
        contentType: String
},
});

mongoose.model('Services', aboutModelSchema);