function getAllBooks() {
  var ary = [];
  var book = {};
  var numBooks = 0;
  firebase.database().ref('/book').on('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
      var book = childsnapshot.val();
      book = {
        'title': book.title,
        'author': book.author,
        'rate': book.rate,
        'time': book.time
      };

      ary[numBooks++] = book;

    });
  });


  return ary;
}
