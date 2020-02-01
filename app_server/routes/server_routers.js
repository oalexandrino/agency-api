var express = require('express');
var homePageController = require('../controllers/homePageController');
var pageNotFoundController = require('../controllers/pageNotFoundController');
var router = express.Router();


/* GET home page. */ 
router.get('/', homePageController.index);
router.get('/pageNotFound', pageNotFoundController.index);
module.exports = router;
