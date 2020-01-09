var express = require('express');
var mainController = require('../controllers/main');
var router = express.Router();


/* GET home page. */ 
router.get('/', mainController.index);
module.exports = router;
