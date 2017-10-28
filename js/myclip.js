"use strict"

$(function ($) {
  $('#addBooks').click(function() {
    var $els = $("tr input[type='checkbox']:checked");
    $els.each(function(idx, el) {
      $("#tab tbody").append($('#rowTemplate').html());
      $("#tab tbody > tr:last-child .book-title").text($(el).parents("tr").find(".book-title").text())
      $("#tab tbody > tr:last-child .book-author").text($(el).parents("tr").find(".book-author").text())
    });
  });

  $('.start').click(function(){
    var d = new Date();
    $(this).parents("tr").find(".date-started").text(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
    $(this).empty().text('독서 종료').removeClass("start btn-secondary").addClass("btn-success end");

    $('.end').click(function(){
      $(this).empty().text("독서 완료됨").removeClass("btn-success end").addClass("disabled");
      $(this).parents("tr").find(".date-ended").text(d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate());
    });
  });
  $('#del').click(function() {
    if (confirm("선택한 도서를 삭제하시겠습니까?")) {
      var $els = $("tr input[type='checkbox']:checked");
      $els.each(function(idx, el) {
        $(el).parents("tr").empty();
      });
      recalculate();
    }
  });

});

$(function($){
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
