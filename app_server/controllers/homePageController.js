//var homePageDataObject = require('../../app_api/models/data/homePageDataObject');
var ApiConfiguration = require('../../app_api/lib/agency/settings/ApiConfiguration');
var request = require('request');
var Promise = require("bluebird");
var request = require('request-promise');
const nodemailer = require('nodemailer');

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
        ,
        {
            url: url + '/api/team/image/',
            headers: { 'headers': 'apitoken' }
        },
        {
            url: url + '/api/team/description',
            headers: { 'headers': 'apitoken' }
        },
        {
            url: url + '/api/about/',
            headers: { 'headers': 'apitoken' }
        },
        {
            url: url + '/api/about/images/',
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

        // console.log("output: ");
        // console.log(homePageData);

        res.render('index', homePageData);

    }, function (err) {
        if (err)
            console.log(err);
    });
};

var sendEmail = function (req, res) {
    
    const message = req.body.message;
    const email = req.body.email;
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: process.env.EMAIL_TLS }
    });
    
    const mailOptionsToWebSite = {
        from: process.env.EMAIL_FROM_EMAIL,
        to: process.env.EMAIL_FROM_TO,
        subject: process.env.EMAIL_SUBJECT_WEBSITE,
        html: message
    };
    
    const mailOptionsToSender = {
        from: process.env.EMAIL_FROM_EMAIL,
        to: email,
        subject: process.env.EMAIL_SUBJECT_SENDER,
        html: process.env.EMAIL_MESSAGE
    };
    
    transporter.sendMail(mailOptionsToWebSite, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email to website sent: ' + info.response);
        }
    });
    
    transporter.sendMail(mailOptionsToSender, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email to sender sent: ' + info.response);
        }
    });    
    
    res.end();
}

module.exports.index = homePageInfo;
module.exports.sendEmail = sendEmail;