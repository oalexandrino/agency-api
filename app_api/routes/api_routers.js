var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController');
var serviceController = require('../controllers/serviceController');

// routes for service model
router.post('/service/', serviceController.save);
router.get('/service/', serviceController.serviceListing);
router.get('/service/:idService', serviceController.getService);

// routes for team model
router.get('/team/', teamController.teamInfo);
router.post('/team/', teamController.addTeamMember);
router.post('/team/members/', teamController.removeMember);
router.get('/team/members/', teamController.members);
router.get('/team/members/:email', teamController.getTeamMember);
router.get('/team/title', teamController.title);
router.get('/team/headline', teamController.headline);
router.get('/team/description', teamController.description);

module.exports = router;