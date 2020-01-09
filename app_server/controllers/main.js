var homePageTemplateView = 'index';
var homePageDataObject = { title: 'I am an Express app!' };
var homepageController = function (req, res) { res.render(homePageTemplateView, homePageDataObject); };

module.exports.index = homepageController;