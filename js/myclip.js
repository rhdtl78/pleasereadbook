"use strict"

var currentUser;
firebase.auth().onAuthStateChanged(function (user){
  if(user) {
  currentUser = user;
  resettab();
  } else {
    alert("로그인이 필요합니다.");
  }
});


function resettab () { //선택해놓은 책 목록 새로고침하는 함수
  $('#tab > tbody > *').remove();
  var user = currentUser;
  var bookTitle;
  var bookAuthor;
  var timeStart;
  var timeEnd;
  var ary = [];
  var book = {};
  var numBooks = 0;
  firebase.database().ref('/users/' + user.uid + '/reading').on('value', function(snapshot) { //여기 ref 경로 수정필요
    snapshot.forEach(function(childsnapshot) {
      firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key).on('value', function(book) {
        bookTitle = book.val().title;
        bookAuthor = book.val().author;
        timeStart = book.val().timeStart;
        timeEnd = book.val().timeEnd;

        book = {
          'title': bookTitle,
          'author': bookAuthor,
          'time-start': timeStart,
          'time-end': timeEnd
        };

        ary[numBooks++] = book;

      });
    });
  });
  for (var i = 0; i < ary.length; i++) {

    $('#tab tbody').append("<tr><td><input type='checkbox'></td><td>" + ary[i].title + "</td><td>" + ary[i].author + "<td>" + ary[i].timeStart + "</td><td>" + ary[i].timeEnd + "</td></tr>");
  }


}

$(function ($) {
  $('#addBooks').click(function() { // 책 선택창 (팝업) 에서 선택 완료 버튼
    var user = currentUser;
    var $els = $("#bookList tr input[type='checkbox']:checked");
    var book = [];
    $els.each(function(idx, el) {
      book[idx] = {
        'title': $(el).parents("tr").find('book-title').text(),
        'author': $(el).parents("tr").find('book-author').text(),
        'time-start' : '',
        'time-end' : ''
      };
    });
    firebase.database().ref('/users/' + user.uid + '/reading').push(book);
    resettab();
  });

   // TODO: 시작, 종료 누를 때 DB 유저정보에 상태 업데이트
   //       종료 누를 때 DB에 독파시간 저장
  $('.start').click(function(){ // 읽기 시작 버튼
    var user = currentUser;
    var d = new Date();
    var btitle = $(this).parents(tr).find('book-title').text();
    database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var bookKey = childSnapshot.key;
        var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);

        userDB.on('value', function(book) {
          if( btitle == book.val().title){
            firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key + 'timeStart').update(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
          }
        });
      });
    });
    resettab();
    
    $(this).empty().text('독서 종료').removeClass("start btn-secondary").addClass("btn-success end");

    $('.end').click(function(){ // 읽기 완료 버튼
      var user = currentUser;
      $(this).empty().text("독서 완료됨").removeClass("btn-success end").addClass("disabled"); //'독서 완료됨' 버튼 대신 버튼을 없애고 '독파시간: 00일 00시간' 으로 표시하는 것도 고려
      database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var bookKey = childSnapshot.key;
          var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);
  
          userDB.on('value', function(book) {
            if( btitle == book.val().title){
              firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key + 'timeEnd').update(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
            }
          });
        });
      });
      //TODO: 읽기 완료 시 평점 선택 기록
      resettab();
    });
  });
  $('#del').click(function() { // 도서 삭제 버튼
    if (confirm("선택한 도서를 삭제하시겠습니까?")) {
      var user = currentUser;
      var $els = $("tr input[type='checkbox']:checked");
      $els.each(function(idx, el) {
        //TODO: 도서 삭제하면 DB 유저정보에서 책 (키값) 삭제 
        var btitle = $(this).parents(tr).find('book-title').text();
        database.ref('/users/' + user.uid + '/reading').on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var bookKey = childSnapshot.key;
            var userDB = database.ref('/users/' + user.uid + '/reading' + bookKey);
    
            userDB.on('value', function(book) {
              if( btitle == book.val().title){
                firebase.database().ref('/users/' + user.uid + '/reading' + childsnapshot.key).remove();
              }
            });
          });
        });
      });
      resettab();
    }
  });

});

$('#add').click(function(){ // 책 선택창 (팝업) 띄우는 버튼
  $('#bookList > tbody > *').remove();
  var bookTitle;
  var bookAuthor;
  var bookRate;
  var ary = [];
  var book = {};
  var numBooks = 0;
  firebase.database().ref('/book').on('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
      firebase.database().ref('/book/' + childsnapshot.key).on('value', function(book) {
        bookTitle = book.val().title;
        bookAuthor = book.val().author;
        bookRate = book.val().rate;

        book = {
          'title': bookTitle,
          'author': bookAuthor,
          'rate': bookRate
        };

        ary[numBooks++] = book;

      });
    });
  });

  for (var i = 0; i < ary.length; i++) {
    $('#bookList tbody').append("<tr><td><input type='checkbox'></td><td></td><td class='book-title'>" + ary[i].title + "</td><td class='book-author'>" + ary[i].author + "</td><td>" + ary[i].rate +"</td></tr>");
  }
});
