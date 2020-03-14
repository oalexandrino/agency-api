var mongoose = require('mongoose');
var WebsiteModel = mongoose.model('agencyWebsiteConfiguration');
var responseUtilities = require("../../lib/agency/util/responseUtilities");

module.exports.update = function (req, res) {

    WebsiteModel.find().exec(function (err, content) {

        var _id = content[0]._id;
        var valid = mongoose.Types.ObjectId.isValid(_id);

        if (valid ) {

            var query = {_id: _id};
            var options = { new: true };
            var update = {
                $set: {
                    _id: _id,
                    site_title: req.body.site_title,
                    site_headline: req.body.site_headline,
                    link_site: req.body.link_site,
                    service_headline: req.body.service_headline,
                    portfolio_headline: req.body.portfolio_headline,
                    about_headline: req.body.about_headline,
                    contact_headline: req.body.contact_headline
                }
            };

            WebsiteModel.findByIdAndUpdate(query, update, options, function (err, result) {
                var message = "General configurations have been updated successful.";
                if (!result) {
                    message = "Error at updating general configurations.";
                }
                responseUtilities.sendJSON(res, err, { "message": message });
            }
            );
        }
        else {
            responseUtilities.sendJSON(res, err, { "message": "Error at updating general configurations. Problem at finding the document." });
        }
    });
};

module.exports.configListing = function (req, res) {
    WebsiteModel.find().exec(function (err, content) {
        responseUtilities.sendJSON(res, err, { "config": content });
    });
};
