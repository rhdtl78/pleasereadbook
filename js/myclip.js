"use strict"

$('#addBooks').click(function() {
  var $els = $("tr input[type='checkbox']:checked");
  $els.each(function(idx, el) {
    $("#tab tbody").append($('#rowTemplate').html());
    $("#tab tbody > tr:last-child .book-title").text($(el).parents("tr").find(".book-title").text())
    $("#tab tbody > tr:last-child .book-author").text($(el).parents("tr").find(".book-author").text())
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

