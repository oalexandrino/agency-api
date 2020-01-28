var mongoose = require('mongoose');

var serviceModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    fontawesomeIcon: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }},{
        collection: 'service'
    }
);




serviceModelSchema.set('collection', 'service');
mongoose.model('service', serviceModelSchema);