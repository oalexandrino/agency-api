var homePageTemplateView = 'index';
var homePageDataObject = { title: 'Agency website: Bootstrap, Express and Node.Js' };
var homepageController = function (req, res) { res.render(homePageTemplateView, homePageDataObject); };

module.exports.index = homepageController;