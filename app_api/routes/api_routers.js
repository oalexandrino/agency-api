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
router.post('/team/image/', upload.any(), teamController.addImage2);
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