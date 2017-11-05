const BookDB = firebase.database().ref('/book');
function searchBookByKey(bookKey) {
  BookDB.on('value', snap =>{
    snap.forEach(childSnap =>{
      if(childSnap.key === bookKey) return childSnap.val();
    });
  });
}
