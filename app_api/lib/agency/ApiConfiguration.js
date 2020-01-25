var request = require('request');

var apiOptions = {
    dev: "http://localhost:3000",
    production: "https://agency-angular-express-node.herokuapp.com/"
};


class ApiConfiguration {

    
    static getApiURL() {

        var url;
        if (process.env.NODE_ENV === 'production') {
            url = apiOptions.production;
        } else {
            url = apiOptions.dev;
        }
        
        console.log("url: " + url);
        
        return url;

    }
    
    constructor() {
    }
}

module.exports = ApiConfiguration;