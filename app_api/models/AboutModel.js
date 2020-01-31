var mongoose = require('mongoose');

var aboutModelSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    headline: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 100
    }
}, {
    collection: 'about'
});

aboutModelSchema.set('collection', 'about');
mongoose.model('about', aboutModelSchema);