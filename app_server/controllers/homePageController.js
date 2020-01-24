var homePageDataObject = require('../../app_api/models/data/homePageDataObject');
var ApiConfiguration = require('../../app_api/lib/agency/ApiConfiguration');
var request = require('request');

var homePageInfo = function (req, res) {

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
    });


};



module.exports.index = homePageInfo;
