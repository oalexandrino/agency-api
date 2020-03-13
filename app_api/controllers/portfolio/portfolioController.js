
const firebase = require('firebase');
var responseUtilities = require("../../lib/agency/util/responseUtilities");

module.exports.portfolioListing = function (req, res) {

    var database = firebase.firestore();
    const portfolios = [];

    let portfolio = database.collection('portfolio').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                portfolios.push(doc.data());
            });
            responseUtilities.sendJSON(res, false, {"portfolios": portfolios});
        })
        .catch(err => {
            responseUtilities.sendJSON(res, err, { "message": "Error getting documents" });
        });

};
