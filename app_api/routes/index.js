var express = require('express');
var router = express.Router();
var teamController = require('../controllers/teamController');

router.get('/teamListing', teamController.teamListing);
module.exports = router;