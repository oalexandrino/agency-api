var homePageDataObject = require('../data/homePageDataObject');

var pageInfo = function (req, res) {
    res.render('index', homePageDataObject);
};

module.exports.index = pageInfo;