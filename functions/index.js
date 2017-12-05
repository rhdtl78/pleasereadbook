'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.bookSetting = functions.auth.user().onCreate(event => {
  const user = event.data; // The Firebase user.

  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.

  admin.database().ref('/users/' + user.uid + '/seted').set(false);

});

exports.cleanupUser = functions.auth.user().onDelete(event => {
  const user = event.data;
  const uid = user.uid;

  admin.database().ref('/users/' + user.uid).set(null);
});

exports.countUpExBooks = functions.database.ref('/book/{pushId}').onCreate(event => {  // DB 이벤트 트리거
  var eventSnapshot = event.data;
  var eventedBook = eventSnapshot.val();
  var key = eventSnapshot.key;
  admin.database().ref('/book').once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var btitle = childData.title;
      var bauthor = childData.author;
      var brate = childData.rate = 5;
      var btime = childData.time;
      var bcount = childData.count;
      var bookKey = childSnapshot.key;

      if (btitle === eventedBook.title && bauthor === eventedBook.author && bookKey != key) {
        var update = {};
        update['/book/' + key + '/time'] = (brate * bcount + eventedBook.time) / (bcount + 1);
        admin.database().ref().update(update);
        update['/book/' + key + '/rate'] = (brate * bcount + eventedBook.rate) / (bcount + 1);
        admin.database().ref().update(update);
        update['/book/' + key + '/count'] = bcount + 1;
        admin.database().ref().update(update);
        admin.database().ref('/book/' + bookKey).set(null);
      }
    });
  });
});

const cors = require('cors')({
  origin: true
});
exports.book = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var https = require('https');
    var querystring = require('querystring');
    var search = req.query.search;
    var queryOption = {
      'query': search,
      'display': 10,
      'start': 1,

      'sort': 'sim'
    };
    var query = querystring.stringify(queryOption);
    var client_id = 'qIYzK9T2QbZbi9NDX4qt';
    var client_secret = 'wN8hWqSDa_';
    var host = 'openapi.naver.com';
    var port = 443;
    var uri = '/v1/search/book.json?';
    var options = {
      host: host,
      port: port,
      path: uri + query,
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
      }
    };
    req = https.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function(json) {
        res.send(json);
      });
    });
    req.end();
  });
});
