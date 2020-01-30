var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController');
var serviceController = require('../controllers/serviceController');
var portfolioController = require('../controllers/portfolioController');
var aboutController = require('../controllers/aboutController');

// routes for about model
router.get('/about/', aboutController.aboutListing);

//for uploading
var upload = require('../lib/agency/upload/multerSettings');

// routes for firebase portfolio
router.get('/portfolio/', portfolioController.portfolioListing);

// routes for service model
router.post('/service/', serviceController.save);
router.get('/service/', serviceController.serviceListing);
router.get('/service/:idService', serviceController.getService);
router.delete('/service/', serviceController.delete);
router.put('/service/', serviceController.update);

// routes for member model
router.post('/team/members/', teamController.addTeamMember);
router.get('/team/members/', teamController.members);
router.delete('/team/members/', teamController.removeMember);
router.get('/team/members/:email', teamController.getTeamMember);

// routes for member images model 
router.post('/team/image/', upload.any(), teamController.addImage);
router.get('/team/image/', teamController.getTeamMemberImages);

// routes for team model
router.get('/team/', teamController.teamInfo);
router.put('/team/', teamController.teamInfoUpdate);
router.get('/team/title', teamController.title);
router.get('/team/headline', teamController.headline);
router.get('/team/description', teamController.description);

module.exports = router;