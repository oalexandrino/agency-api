var express = require('express');
var homePageController = require('../controllers/homePageController');
var router = express.Router();


/* GET home page. */ 
router.get('/', homePageController.index);
module.exports = router;
