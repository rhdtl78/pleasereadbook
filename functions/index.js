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

exports.countUpExBooks = functions.database.ref('/books/{pushId}').onWrite(event => {
  var eventSnapshot = event.data;
  var eventedBook = eventSnapshot.val();
  var key = eventSnapshot.key;

  admin.database().ref('/books').on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();

      var btitle = childData.title;
      var bauthor = childData.author;
      var brate = childData.rate;
      var btime = childData.time;
      var bcount = childData.count;
      var bookKey = childSnapshot.key;

      if (btitle === eventedBook.title && bauthor === eventBook.author) {
        var update = {};
        update['/books/' + key + '/time'] = (brate * bcount + eventedBook.time) / (bcount + 1);
        admin.database().ref().update(update);
        update['/books/' + key + '/rate'] = (brate * bcount + eventedBook.rate) / (bcount + 1);
        admin.database().ref().update(update);
        update['/books' + key + '/count'] = bcount + 1;
        admin.database().ref().update(update);
        admin.database().ref('/books/' + eventSnapshot.key).set(null);
      }
    });
  });
});

var https = require('https');
var querystring = require('querystring');
router.get('/openapi', function(req, res){
    var search = req.query.search;
    var queryOption = {'query':search, 'display':10, 'start':1, 'sort':'sim'};
    var query = querystring.stringify(queryOption);
    var client_id = 'naver_client_id';
    var client_secret = 'naver_client_secret';
    var host = 'openapi.naver.com';
    var port = 443;
    var uri = '/v1/search/shop.xml?';
    var options = {
        host: host,
        port: port,
        path: uri + query,
        method: 'GET',
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
    req = https.request(options, function(response) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        response.setEncoding('utf8');
        response.on('data', function (xml) {
            console.log(xml);
        });
    });
    req.end();
});
