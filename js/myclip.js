"use strict"

$(function ($) {
  $('#addBooks').click(function() { // 책 선택창 (팝업) 에서 선택 완료 버튼
    var $els = $("tr input[type='checkbox']:checked");
    $els.each(function(idx, el) {
      //TODO: 책의 키값 유저정보에 추가
      
    });
    resettab();
  });

   // TODO: 시작, 종료 누를 때 DB 유저정보에 상태 업데이트
   //       종료 누를 때 DB에 독파시간 저장
  $('.start').click(function(){ // 읽기 시작 버튼
    var d = new Date();
    $(this).parents("tr").find(".date-started").text(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
    $(this).empty().text('독서 종료').removeClass("start btn-secondary").addClass("btn-success end");

    $('.end').click(function(){ // 읽기 완료 버튼
      $(this).empty().text("독서 완료됨").removeClass("btn-success end").addClass("disabled"); //'독서 완료됨' 버튼 대신 버튼을 없애고 '독파시간: 00일 00시간' 으로 표시하는 것도 고려
      $(this).parents("tr").find(".date-ended").text(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
      //TODO: 읽기 완료 시 평점 선택 기록
    });
  });
  $('#del').click(function() { // 도서 삭제 버튼
    if (confirm("선택한 도서를 삭제하시겠습니까?")) {
      var $els = $("tr input[type='checkbox']:checked");
      $els.each(function(idx, el) {
        //TODO: 도서 삭제하면 DB 유저정보에서 책 (키값) 삭제 
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
    $('#bookList tbody').append($('#ModalTemplate').html());
    $('#bookList tbody tr:last-child').find('book-title').append(ary[i].title);
    $('#bookList tbody tr:last-child').find('book-author').append(ary[i].author);
    $('#bookList tbody tr:last-child').find('book-rate').append(ary[i].rate);
  }
});


//TODO: /users/(선택한 책목록) 에서 책의 키를 가져와 /book에서 비교해 같은 것들을 목록에 표시
//      책의 읽기 상태도 불러와야 함 (YYYY.MM.DD 에 읽기 시작)
$(function resettab ($) { //선택해놓은 책 목록 새로고침하는 함수
  $('#tab > tbody > *').remove();
  var bookTitle;
  var bookAuthor;
  var bookRate;
  var ary = [];
  var book = {};
  var numBooks = 0;
  firebase.database().ref('/users').on('value', function(snapshot) { //여기 ref 경로 수정필요
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
    $('#bookList tbody').append($('#ModalTemplate').html());
    $('#bookList tbody tr:last-child').find('book-title').append(ary[i].title);
    $('#bookList tbody tr:last-child').find('book-author').append(ary[i].author);
    $('#bookList tbody tr:last-child').find('book-rate').append(ary[i].rate);
  }


});
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    resettab();
  } else {
    alert("로그인이 필요합니다.");
  }
});
