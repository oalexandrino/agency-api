var mongoose = require('mongoose');

var servicesModelSchema = new mongoose.Schema({
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
    image: {
            data: Buffer,
            contentType: String
    },
});

mongoose.model('Services', servicesModelSchema);