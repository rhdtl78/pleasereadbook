function getAllBooks() {
  var bookTitle;
  var bookAuthor;
  var bookRate;
  var bookTime;
  var ary = [];
  var book = {};
  var numBooks = 0;
  firebase.database().ref('/book').on('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
      firebase.database().ref('/book/' + childsnapshot.key).on('value', function(book) {
        bookTitle = book.val().title;
        bookAuthor = book.val().author;
        bookRate = book.val().rate;
        bookTime = book.val().time;

        book = {
          'title': bookTitle,
          'author': bookAuthor,
          'rate': bookRate,
          'time': bookTime
        };

        ary[numBooks++] = book;

      });
    });
  });

  return ary;
}
