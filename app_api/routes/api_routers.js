var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController');
var serviceController = require('../controllers/serviceController');

// routes for service model
router.post('/service/', serviceController.save);
router.get('/service/', serviceController.serviceListing);
router.get('/service/:idService', serviceController.getService);

// routes for team model
router.get('/team/info', teamController.teamInfo);
router.get('/team/title', teamController.title);
router.get('/team/headline', teamController.headline);
router.get('/team/description', teamController.description);
router.get('/team', teamController.team);
router.get('/team/:email', teamController.getTeamMember);

module.exports = router;