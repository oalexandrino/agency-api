var homePageDataObject = require('../../app_api/models/data/homePageDataObject');
var ApiConfiguration = require('../../app_api/lib/agency/ApiConfiguration');
var request = require('request');
var Promise = require("bluebird");
var request = require('request-promise');


var homePageInfo = function (req, res) {
    
    
    // create request objects
    /*
    var requests = [{
        url: ApiConfiguration.getApiURL() + '/api/service/',
        headers: {
            'Bearer': 'sampleapitoken'
        }
    }, {
            url: ApiConfiguration.getApiURL() + '/api/team/members/',
        headers: {
            'Bearer': 'sampleapitoken'
        }
        }];*/
    
    // create request objects
    var url = ApiConfiguration.getApiURL();
    var requests = [ {
        url: url + '/api/team/members/',
        headers: {
            'Bearer': 'sampleapitoken'
        }
    }];
    
    console.log("url: " + requests.url);

    Promise.map(requests, function (obj) {
        return request(obj).then(function (body) {
            return JSON.parse(body);
        });
    }).then(function (results) {
        console.log(results);
        var output = [];
        for (var i = 0; i < results.length; i++) {
            //output.push(results[i]);
            res.render('index', results[i]);
            
        }
        //res.render('index', output);
    
    }, function (err) {
        // handle all your errors here
    });

    
    /*

    var requestOptions, path;
    path = '/api/service/';

    requestOptions = {
        url: ApiConfiguration.getApiURL() + path,
        method: "GET",
        json: {}
    };

    request(requestOptions, function (err, response, body) {

        var data = { "portfolioData": homePageDataObject, "serviceData": body };
        res.render('index', data);
    });*/


};



module.exports.index = homePageInfo;
