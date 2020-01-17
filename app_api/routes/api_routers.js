var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController');

router.get('/team', teamController.teamListing);
router.get('/team/:email', teamController.getTeamMember);
module.exports = router;