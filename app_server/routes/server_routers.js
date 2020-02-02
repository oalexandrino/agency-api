var express = require('express');
var homePageController = require('../controllers/homePageController');
var pageNotFoundController = require('../controllers/pageNotFoundController');
var router = express.Router();

router.get('/', homePageController.index);
router.get('/pageNotFound', pageNotFoundController.index);
router.post('/sendEmail', homePageController.sendEmail);
module.exports = router;
