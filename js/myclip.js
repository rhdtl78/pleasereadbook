"use strict"

$(function($) {
  const auth = firebase.auth();
  auth.onAuthStateChanged(user => {
    if (user) {
      var numBooks = 0;
      const dbReference = firebase.database().ref('/users/' + user.uid + '/reading');
      dbReference.once('value', function(snapshot) { //여기 ref 경로 수정필요
        snapshot.forEach(function(childSnap) {
          var childKey = childSnap.key;
          var childData = childSnap.val();
          console.log(childData);
          appendToTable({
            'title': childData.title,
            'author': childData.author,
            'time-start': childData.timeStart,
            'time-end': childData.timeEnd
          });
        });
      });
      $('#add').click(function() { // 책 선택창 (팝업) 띄우는 버튼
        $('#bookList > tbody > *').remove();
        var ary = [];
        firebase.database().ref('/book').on('value', function(snapshot) {
          snapshot.forEach(function(childSnap) {
            var childKey = childSnap.key;
            var childData = childSnap.val();
            ary.push({
              'title': childData.title,
              'author': childData.author,
              'rate': childData.rate
            });
          });
        });
        for (var i = 0; i < ary.length; i++) {
          $('#bookList tbody').append("<tr><td><input type='checkbox'></td><td></td><td class='book-title'>" + ary[i].title + "</td><td class='book-author'>" + ary[i].author + "</td><td>" + ary[i].rate + "</td></tr>");
        }
      });
      $('#addBooks').click(function() { // 책 선택창 (팝업) 에서 선택 완료 버튼
        var $els = $("#bookList tr input[type='checkbox']:checked");
        $els.each(function(idx, el) {
          firebase.database().ref('/users/' + user.uid + '/reading').push({
            'title': $(el).parents("tr").find('.book-title').text(),
            'author': $(el).parents("tr").find('.book-author').text(),
            'time-start': '',
            'time-end': ''
          });
        });
      });

      // TODO: 시작, 종료 누를 때 DB 유저정보에 상태 업데이트
      //       종료 누를 때 DB에 독파시간 저장
      $('.start').click(function() { // 읽기 시작 버튼
        var d = new Date();
        var btitle = $(this).parents(tr).find('.book-title').text();
        database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var bookKey = childSnapshot.key;
            var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);

            userDB.on('value', function(book) {
              if (btitle == book.val().title) {
                firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key + 'timeStart').update(d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate());
              }
            });
          });
        });
        //$(this).empty().text('독서 종료').removeClass("start btn-secondary").addClass("btn-success end");
      });

      $('.end').click(function() { // 읽기 완료 버튼
        //$(this).empty().text("독서 완료됨").removeClass("btn-success end").addClass("disabled"); //'독서 완료됨' 버튼 대신 버튼을 없애고 '독파시간: 00일 00시간' 으로 표시하는 것도 고려
        database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var bookKey = childSnapshot.key;
            var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);

            userDB.on('value', function(book) {
              if (btitle == book.val().title) {
                firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key + 'timeEnd').update(d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate());
              }
            });
          });
        });
        //TODO: 읽기 완료 시 평점 선택 기록
      });
      $('#del').click(function() { // 도서 삭제 버튼
        if (confirm("선택한 도서를 삭제하시겠습니까?")) {
          var $els = $("tr input[type='checkbox']:checked");
          $els.each(function(idx, el) {
            //TODO: 도서 삭제하면 DB 유저정보에서 책 (키값) 삭제
            var btitle = $(el).parents(tr).find('.book-title').text();
            database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var bookKey = childSnapshot.key;
                var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);

                userDB.on('value', function(book) {
                  if (btitle == book.val().title) {
                    firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key).remove();
                  }
                });
              });
            });
          });
        }
      });

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
  $('#tab tbody').append("<tr><td><input type='checkbox'></td><td>" + object.title + "</td><td>" + object.author + "</td><td class='startTime'></td><td class='endTime'></td><td class='Btn'></td></tr>"); // + object.timeStart + "</td><td>" + object.timeEnd + "</td><td><button class='btn btn-secondary start'>독서 시작</button></td></tr>");
  if (object.timeStart) {
    $('#tab tbody tr:last-child .startTime').append(object.timeStart);
    /*} else {
      $('#tab tbody tr:last-child .startTime').append("아직");*/
  }
  if (object.timeEnd) {
    $('#tab tbody tr:last-child .endTime').append(object.timeEnd);
    /*} else {
      $('#tab tbody tr:last-child .endTime').append("아직");*/
  }
  if (object.timeStart) {
    if (object.timeEnd) {
      $('#tab tbody tr:last-child .Btn').append("<button class='btn disabled'>독서 완료됨</button>");
    } else {
      $('#tab tbody tr:last-child .Btn').append("<button class='btn btn-success end'>독서 완료</button>");
    }
  } else {
    $('#tab tbody tr:last-child .Btn').append("<button class='btn btn-secondary start'>독서 시작</button>");
  }
}
