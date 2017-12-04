$(function($) {
  function setTable(ary) {
    $('tbody>*').remove();
    for (var i = 0; i < ary.length; i++) {
      $('tbody').append("<tr><th>" + (i + 1) + "</th><td><img src ='"+ary[i].cover+"'></td><td>" + ary[i].title + "</td><td>" + ary[i].author + "</td><td>" + ary[i].rate + "</td><td>" + ary[i].time + "</td><td>" + ary[i].count + "</td></tr>");
    }
  }

  $('#login').click(function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      alert("로그인 성공");
      var ary = getAllBooks();
      setTable(ary);
    }).catch(function(error) {
      alert(error);
    });
  });

  $('#logoutUp').click(function() {
    firebase.auth().signOut().then(function() {
      window.location.href = "/register.html";
    }, function(error) {
      alert(error);
    });
  });

  var ary = []
  const auth = firebase.auth();
  auth.onAuthStateChanged(user => {
    if (user) {
      const dbReference = firebase.database().ref('/book');
      dbReference.on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
          var childData = childSnap.val();
          ary.push({
            'title': childData.title,
            'cover': childData.coverUrl,
            'author': childData.author,
            'rate': childData.rate,
            'time': childData.time,
            'count':childData.count
          });
        });
        setTable(ary);
      });
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/register.html";
    }
  });

  $('#rate').click(function() {
    ary = getAllBooks();
    Sort('rate',ary);
    setTable(ary);
  });

  $('#time').click(function() {
    ary = getAllBooks();
    Sort('time',ary);
    setTable(ary);
  });

  $('#count').click(function() {
    ary = getAllBooks();
    Sort('count',ary);
    setTable(ary);
  });

  $('#title').click(function() {
    ary = getAllBooks();
    ary.sort(function sortComparer(a, b) {
      return a.title.localeCompare(b.title);
    });
    setTable(ary);
  });

  $('#help').click(function(){
    var storageRef = firebase.storage().ref();

    storageRef.child('HELP/help_recommend.jpg').getDownloadURL().then(function(url){
      window.open(url, '도움말');
    });
  });

});
