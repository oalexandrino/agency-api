var request = require('request');

var apiOptions = {
    dev: "http://localhost:3000",
    production: "https://agency-angular-express-node.herokuapp.com/"
};


class ApiConfiguration {
    
    static setAppOptions() {

        if (process.env.NODE_ENV === 'production') {
            this.server = apiOptions.production;
        } else {
            this.server = apiOptions.dev;
        }

    }
    
    static getApiURL() {
        this.setAppOptions();
        return this.server;
    }
    
    constructor() {
    }
}

module.exports = ApiConfiguration;