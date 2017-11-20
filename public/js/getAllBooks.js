function getAllBooks() {
  var ary = [];
  var books = {};
  var numBooks = 0;
  firebase.database().ref('/book').on('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
      var book = childsnapshot.val();
      books = {
        'title': book.title,
        'cover':book.coverUrl,
        'author': book.author,
        'rate': book.rate,
        'time': book.time
      };

      ary[numBooks++] = books;

    });
  });


  return ary;
}
