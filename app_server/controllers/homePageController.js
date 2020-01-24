var homePageDataObject = require('../../app_api/models/data/homePageDataObject');
var ApiConfiguration = require('../../app_api/lib/agency/ApiConfiguration');

var homePageInfo = function (req, res) {
    var data = { "portfolioData": homePageDataObject, "serviceData": serviceList };
    res.render('index', data);
};

var renderServiceList = function (req, res, responseBody) {
    return responseBody;
};


var serviceList = function (req, res) {

    var requestOptions, path;
    path = '/api/service/';

    requestOptions = {
        url: ApiConfiguration.getApiURL() + path,
        method: "GET",
        json: {}
    };

    request(requestOptions, function (err, response, body) {
        renderServiceList(req, res, body);
    });
};

module.exports.index = homePageInfo;
