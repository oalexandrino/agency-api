var mongoose = require('mongoose');

var agencyWebsiteModelSchema = new mongoose.Schema({
    site_title: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    site_headline: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    link_site: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    service_headline: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    portfolio_headline: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    about_headline: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    contact_headline: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }},{
        collection: 'agencyWebsiteConfiguration'
    }
);

agencyWebsiteModelSchema.set('collection', 'agencyWebsiteConfiguration');
mongoose.model('agencyWebsiteConfiguration', agencyWebsiteModelSchema);