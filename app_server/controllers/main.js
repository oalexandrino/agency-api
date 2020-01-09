var homePageTemplateView = 'index';
var homePageDataObject = { title: 'I am an Express app and I am live at Herokuapp!' };
var homepageController = function (req, res) { res.render(homePageTemplateView, homePageDataObject); };

module.exports.index = homepageController;