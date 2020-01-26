const firebaseConfig = {
    apiKey: "AIzaSyADr0EzuAZjfvD34DAV6z5w0N806-pMLPo",
    authDomain: "agency-website-2b82f.firebaseapp.com",
    databaseURL: 'https://agency-website-2b82f.firebaseio.com',
    projectId: "agency-website-2b82f",
    storageBucket: "agency-website-2b82f.appspot.com",
    messagingSenderId: "619747259950",
    appId: "agency-website-2b82f"
};

class FirebaseConnection {
    
    constructor(firebase) {
        
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.firestore();
        
        /*
        var database = firebase.firestore();
        let portfolio = database.collection('portfolio');
        let allPortfolio = portfolio.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });*/
    }
    
    getDatabase() {
        return this.database;
    }

    
}

module.exports = FirebaseConnection;