"use strict"
$(function($) {

  const auth = firebase.auth();
  var user;
  auth.onAuthStateChanged(user => {
    if (user) {
      user = user;
      var numBooks = 0;
      $('#add').click(function() { // 책 선택창 (팝업) 띄우는 버튼
        $('#bookList > tbody > *').remove();
        var ary = [];
        firebase.database().ref('/book').on('value', function(snapshot) {
          snapshot.forEach(function(childSnap) {
            var childKey = childSnap.key;
            var childData = childSnap.val();
            ary.push({
              'title': childData.title,
              'coverUrl': childData.coverUrl,
              'author': childData.author,
              'rate': childData.rate,
              'time': childData.time,
              'key': childKey
            });
          });
          for (var i = 0; i < ary.length; i++) {
            $('#bookList tbody').append("<tr><td><input type='checkbox'></td><td><img src='" + ary[i].coverUrl + "' alt='이미지 준비중'></td><td class='book-title'>" + ary[i].title + "</td><td class='book-author'>" + ary[i].author + "</td><td>" + ary[i].rate + "</td><td>" + ary[i].time + "</td><td class='imgUrl'>" + ary[i].coverUrl + "</td><td class='keytab'>" + ary[i].key + "</td></tr>");
          }
        });
        $('#rate').click(function() {
          var ary = SetList();
          Sort('rate',ary);
          AppendList(ary);
        });
  
        $('#time').click(function() {
          var ary = SetList();
          Sort('time',ary);
          ary.reverse();
          AppendList(ary);
        });
  
        $('#title').click(function() {
          var ary = SetList();
           ary.sort(function sortComparer(a, b) {
              return a.title.localeCompare(b.title);
            });
          AppendList(ary);
        });
      });
      
      $('#addBooks').click(function() { // 책 선택창 (팝업) 에서 선택 완료 버튼
        var $els = $("#bookList tr input[type='checkbox']:checked");
        $els.each(function(idx, el) {
          firebase.database().ref('/users/' + user.uid + '/reading').push({
            'title': $(el).parents("tr").find('.book-title').text(),
            'author': $(el).parents("tr").find('.book-author').text(),
            'coverUrl': $(el).parents("tr").find('.imgUrl').text(),
            'timeStart': '',
            'timeEnd': '',
            'originkey': $(el).parents("tr").find('.keytab').text()
          });
        });
      });

      $('#del').click(function() { // 도서 삭제 버튼
        if (confirm("선택한 도서를 삭제하시겠습니까?")) {
          var $els = $("#tab tr input[type='checkbox']:checked");
          $els.each(function(idx, el) {
            var bkey = $(el).parents("tr").find('.keytab').text();
            firebase.database().ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var bookKey = childSnapshot.key;
                if(bookKey == bkey){
                  firebase.database().ref('/users/' + user.uid + '/reading/' + bookKey).remove();
                }
              });
            });
          });
        }
      });

      firebase.database().ref('/users/'+user.uid+'/reading').on('value', snap=>{
        var ary = [];
        var i = 0;
        snap.forEach(child=>{
          var key = child.key;
          var book = {
            'title':child.val().title,
            'coverUrl': child.val().coverUrl,
            'author':child.val().author,
            'timeStart':child.val().timeStart,
            'timeEnd':child.val().timeEnd,
            'key':key,
            'originkey':child.val().originkey
          }
          ary[i++] = book;
        });
        setTable(ary);
      });

      function setTable(ary) {
        $('#tab > tbody > *').remove();
        for (var i = 0; i < ary.length; i++) {
          appendToTable(ary[i]);
        }
      }
      
      function appendToTable(object) {
        $('#tab tbody').append("<tr><td><input type='checkbox'></td><td>" + object.title + "</td><td><img  src='" + object.coverUrl + "' alt='이미지 준비중'</td><td>" + object.author + "</td><td class='startTime'></td><td class='endTime'></td><td class='Btn'></td><td class='keytab'>" + object.key + "</td><td class='originkeytab'>" + object.originkey + "</td></tr>");
    
        if (object.timeStart) {
          $('#tab tbody tr:last-child .startTime').append(object.timeStart);
        }
        if (object.timeEnd) {
          $('#tab tbody tr:last-child .endTime').append(object.timeEnd);
        }
        if (object.timeStart) {
          if (object.timeEnd) {
            $('#tab tbody tr:last-child .Btn').append("<button class='btn disabled'>독서 완료됨</button>");
          } else {
            $("<button class='btn btn-success end' data-toggle='modal' data-target='#rateModal'>독서 완료</button>").appendTo('#tab tbody tr:last-child .Btn').click(function(){
              var d = new Date();
              var bkey = $(this).parents('tr').find('.keytab').text();
              firebase.database().ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                  var bookKey = childSnapshot.key;
                  if(bookKey == bkey){
                    firebase.database().ref('/users/' + user.uid + '/reading/' + bookKey + '/timeEnd').set(d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate());
                  }
                });
              });
              
              //평점 입력용 Modal js코드

              $('#rateModalLabel').append(object.title + ": 책이 마음에 드셨나요?" );
              $('#rateConfirm').click(function(){
                alert("반영되었습니다!");
                
                var newRate = 0;
                newRate = $("#rate-radio input[type='radio']:checked").value;
                console.log(newRate);
                var originkey = $(this).parents('tr').find('.originkeytab').text();
                firebase.database().ref('/book').on('value', function(snapshot){
                  snapshot.forEach(function(childSnapshot){
                    if(originkey == childSnapshot.key){
                      newRate += childSnapshot.rate;
                      console.log(newRate);
                    }
                  });
                });  
              });
              

            });
          }
        } else {
          $("<button class='btn btn-secondary start'>독서 시작</button>").appendTo('#tab tbody tr:last-child .Btn').click(function(){
            var d = new Date();
            var bkey = $(this).parents('tr').find('.keytab').text();
            firebase.database().ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var bookKey = childSnapshot.key;
                if(bookKey == bkey){
                  firebase.database().ref('/users/' + user.uid + '/reading/' + bookKey + '/timeStart').set(d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate());
                }
              });
            });
          });
        }
      }
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/register.html";
    }
  });
  
});



function setTable(ary) {
  $('#tab > tbody > *').remove();
  for (var i = 0; i < ary.length; i++) {
    appendToTable(ary[i]);
  }
}

function appendToTable(object) {
  $('#tab tbody').append("<tr><td><input type='checkbox'></td><td>" + object.title + "</td><td><img  src='" + object.coverUrl + "' alt='이미지 준비중'></td><td>" + object.author + "</td><td class='startTime'></td><td class='endTime'></td><td class='Btn'></td><td class='keytab'>" + object.key + "</td></tr>");
  console.log("tab append실행됨");
  if (object.timeStart) {
    $('#tab tbody tr:last-child .startTime').append(object.timeStart);
  }
  if (object.timeEnd) {
    $('#tab tbody tr:last-child .endTime').append(object.timeEnd);
  }
  if (object.timeStart) {
    if (object.timeEnd) {
      $('#tab tbody tr:last-child .Btn').append("<button class='btn disabled'>독서 완료됨</button>");
    } else {
      $('#tab tbody tr:last-child .Btn').append("<button class='btn btn-success end'>독서 완료</button>");
    }
  } else {
    $("<button class='btn btn-secondary start'>독서 시작</button>").appendTo('#tab tbody tr:last-child .Btn').click(function(){
      var d = new Date();
      var bkey = $(this).parents('tr').find('.keytab').text();
      firebase.database().ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var bookKey = childSnapshot.key;
          if(bookKey == bkey){
            firebase.database().ref('/users/' + user.uid + '/reading/' + bookKey + '/timeStart').set(d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate());
          }
        });
      });
    });
  }
}
$('#help').click(function(){
  var storageRef = firebase.storage().ref();

  storageRef.child('HELP/help_myclip.JPG').getDownloadURL().then(function(url){
    window.open(url, '도움말');
  });
});

function SetList(){
  $('#bookList > tbody > *').remove();
  var ary = [];
  firebase.database().ref('/book').on('value', function(snapshot) {
    snapshot.forEach(function(childSnap) {
      var childKey = childSnap.key;
      var childData = childSnap.val();
      ary.push({
        'title': childData.title,
        'coverUrl': childData.coverUrl,
        'author': childData.author,
        'rate': childData.rate,
        'time': childData.time,
        'key': childKey
      });
    });
  });
  return ary;
}

function AppendList(ary){
  for (var i = 0; i < ary.length; i++) {
    $('#bookList tbody').append("<tr><td><input type='checkbox'></td><td><img src='" + ary[i].coverUrl + "' alt='이미지 준비중'></td><td class='book-title'>" + ary[i].title + "</td><td class='book-author'>" + ary[i].author + "</td><td>" + ary[i].rate + "</td><td>" + ary[i].time + "</td><td class='imgUrl'>" + ary[i].coverUrl + "</td><td class='keytab'>" + ary[i].key + "</td></tr>");
  }
}