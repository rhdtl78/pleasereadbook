$(function($) {
  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      $('#AUTH_STATE').text("환영합니다"+user.displayName+"님!");
    }
  });

  $('#help').click(function(){
    var storageRef = firebase.storage().ref();

    storageRef.child('HELP/help_index.jpg').getDownloadURL().then(function(url){
      window.open(url, '도움말');
    });
  });

  $('#LOG_OUT').click(function() {
    firebase.auth().signOut().then(function() {
      window.location.href = "/register.html";
    }, function(error) {
      alert(error);
    });
  });
});
