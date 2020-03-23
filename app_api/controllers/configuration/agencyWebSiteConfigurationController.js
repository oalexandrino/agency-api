/*
MIT License

Copyright (c) 2020 Olavo Alexandrino, http://www.oalexandrino.com.br

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var mongoose = require('mongoose');
var WebsiteModel = mongoose.model('agencyWebsiteConfiguration');
var responseUtilities = require("../../lib/agency/util/responseUtilities");

module.exports.update = function (req, res) {

    const {
        site_title,
        site_headline,
        link_site,
        service_headline,
        portfolio_headline,
        about_headline,
        contact_headline } = req.body;

    var query = {};
    var update = {
        $set: {
            site_title: site_title,
            site_headline: site_headline,
            link_site: link_site,
            service_headline: service_headline,
            portfolio_headline: portfolio_headline,
            about_headline: about_headline,
            contact_headline: contact_headline
        }
    };

    WebsiteModel.updateOne(query, update, function (err, result) {
        var message = "General configurations have been updated successful.";
        if (!result) {
            message = "Error at updating general configurations.";
        }
        responseUtilities.sendJSON(res, err, { "message": message });
    }
    );
};

module.exports.configListing = function (req, res) {
    WebsiteModel.find().exec(function (err, content) {
        responseUtilities.sendJSON(res, err, { "config": content });
    });
};
