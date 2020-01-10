var homePageTemplateView = 'index';
var homePageDataObject = { title: 'Agency website' };
var homepageController = function (req, res) { res.render(homePageTemplateView, homePageDataObject); };

module.exports.index = homepageController;