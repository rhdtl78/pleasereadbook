function getAllBooks() {
  var ary = [];
  var books = {};
  var numBooks = 0;
  firebase.database().ref('/book').once('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
      var book = childsnapshot.val();
      books = {
        'title': book.title,
        'cover':book.coverUrl,
        'author': book.author,
        'rate': book.rate,
        'time': book.time,
        'count':book.count
      };
      ary[numBooks++] = books;
    });
  });
  return ary;
}
