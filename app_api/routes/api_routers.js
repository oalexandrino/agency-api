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
var express = require('express');
var router = express.Router();
var teamController = require('../controllers/team/teamController');
var serviceController = require('../controllers/service/serviceController');
var portfolioController = require('../controllers/portfolio/portfolioController');
var aboutController = require('../controllers/about/aboutController');
var agencyWebSiteConfigurationController = require('../controllers/configuration/agencyWebSiteConfigurationController');

// routes for website general configuration
router.get('/config/', agencyWebSiteConfigurationController.configListing);
router.put('/config/', agencyWebSiteConfigurationController.update);

//for uploading
var upload = require('../lib/agency/upload/multerSettings');

// routes for about images model
router.post('/about/image/', upload.any(), aboutController.addImage);
router.get('/about/image/:idAboutItem', aboutController.getImage);
router.get('/about/images/', aboutController.getAboutImages);

// routes for about model
router.post('/about/', aboutController.save);
router.get('/about/', aboutController.aboutListing);
router.get('/about/:idAboutItem', aboutController.getAboutItem);
router.delete('/about/:idAbout', aboutController.delete);
router.put('/about/', aboutController.update);

// routes for firebase portfolio
router.get('/portfolio/', portfolioController.portfolioListing);

// routes for service model
router.post('/service/', serviceController.save);
router.get('/service/', serviceController.serviceListing);
router.get('/service/:idService', serviceController.getService);
router.delete('/service/:idService', serviceController.delete);
router.put('/service/', serviceController.update);

// routes for member model
router.post('/team/members/', teamController.addTeamMember);
router.get('/team/members/', teamController.members);
router.delete('/team/members/:email', teamController.removeMember);
router.get('/team/members/:email', teamController.getTeamMember);
router.put('/team/members/', teamController.teamMemberUpdate);

// routes for member images model
router.post('/team/image/', upload.any(), teamController.addImage);
router.get('/team/image/', teamController.getTeamMemberImages);
router.get('/team/imageMember/', teamController.getTeamMemberImagesAllFields);
router.get('/team/image/:email', teamController.getImage);


// routes for team model
router.get('/team/', teamController.teamInfo);
router.put('/team/', teamController.teamInfoUpdate);
router.get('/team/title', teamController.title);
router.get('/team/headline', teamController.headline);
router.get('/team/description', teamController.description);

module.exports = router;