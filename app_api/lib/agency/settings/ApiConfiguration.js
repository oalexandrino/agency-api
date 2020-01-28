var request = require('request');
const dotenv = require('dotenv');
dotenv.config();

var apiOptions = {
    dev: "http://localhost:3000",
    production: "https://agency-angular-express-node.herokuapp.com"
};



class ApiConfiguration {

    
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