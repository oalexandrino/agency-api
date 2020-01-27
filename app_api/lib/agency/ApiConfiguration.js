var request = require('request');
var cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

var apiOptions = {
    dev: "http://localhost:3000",
    production: "https://agency-angular-express-node.herokuapp.com"
};

cloudinary.config({
    "cloud_name": process.env.CLOUDINARY_CLOUD_NAME,
    "api_key": process.env.CLOUDINARY_API_KEY,
    "api_secret": process.env.CLOUDINARY_API_SECRET,
    "cloudinary_url" : process.env.CLOUDINARY_URL
});


class ApiConfiguration {

    static getCloudinary() { 
       
        return cloudinary;
    }
    
    static getApiURL() {

        var url;
        if (process.env.NODE_ENV === 'production') {
            url = apiOptions.production;
        } else {
            url = apiOptions.dev;
        }

        return url;

    }
    
    constructor() {
    }
}

module.exports = ApiConfiguration;