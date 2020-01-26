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
  
    }
}

module.exports = FirebaseConnection;