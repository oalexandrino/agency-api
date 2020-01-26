//var homePageDataObject = require('../../app_api/models/data/homePageDataObject');
var ApiConfiguration = require('../../app_api/lib/agency/ApiConfiguration');
var request = require('request');
var Promise = require("bluebird");
var request = require('request-promise');


var homePageInfo = function (req, res) {

    // create request objects
    var url = ApiConfiguration.getApiURL();
    var requests = [{
            url: url + '/api/team/members/',
            headers: {'headers': 'apitoken'}},
        {
            url: url + '/api/service/',
            headers: { 'headers': 'apitoken' }
        },
        {
            url: url + '/api/portfolio/',
            headers: { 'headers': 'apitoken' }
        }
    ];

    Promise.map(requests, function (obj) {
        return request(obj).then(function (body) {
            return JSON.parse(body);
        });
    }).then(function (results) {

        var output = [];
        for (var i = 0; i < results.length; i++) {
            
            output.push(results[i]);

        }
        
        var homePageData = { "homePageData": output };
        
        console.log("output: ");
        console.log(homePageData);
        
        res.render('index', homePageData);

    }, function (err) {
        if (err)
            console.log(err);
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