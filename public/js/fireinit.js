// Initialize Firebase
var config = {
  apiKey: "AIzaSyDnzKEvZg6NiGEb3lroB6VEjFZNP_2VVKk",
  authDomain: "pleasereadbook.firebaseapp.com",
  databaseURL: "https://pleasereadbook.firebaseio.com",
  projectId: "pleasereadbook",
  storageBucket: "pleasereadbook.appspot.com",
  messagingSenderId: "291094516014"
};
firebase.initializeApp(config);

function getCurrentUser() {
  firebase.auth().onAuthStateChanged(user =>{
    if(user) return user;
    else return null;
  });
}
