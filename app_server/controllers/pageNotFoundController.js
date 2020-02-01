var ApiConfiguration = require('../../app_api/lib/agency/settings/ApiConfiguration');
var request = require('request');

var pageNotFoundInfo = function (req, res) {
    
    var data = { "url": ApiConfiguration.getApiURL() };
    res.render('404', data);
}

module.exports.index = pageNotFoundInfo;