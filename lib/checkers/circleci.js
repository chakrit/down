
// lib/checkers/circleci.js - circleci.com status check
module.exports = (function() {

  var request = require('request')
    , FeedParser = require('feedparser');

  var ATOM_URL = 'http://status.circleci.com/history.atom';

  var warned = false;

  return function circleci(callback) {
    if (!warned) {
      var warn = 'There are no reliable way to parse up/down status from sites' +
        'that uses statuspage.io so please read the title and check the link for info';
      console.error(warn);
      warned = true;
    }

    var stream = request(ATOM_URL).pipe(new FeedParser);

    stream.once('error', function(e) {
      stream.removeAllListeners();
      return callback(e);
    });

    stream.once('readable', function() {
      var item = stream.read();
      stream.removeAllListeners();

      if (!item) return callback(new Error('no item in status feed.'));

      var updated = item['atom:updated']['#']
        , link = item.link
        , text = item.summary || item.title;

      callback(null, NaN, updated + ' ' + text + ' (' + link + ')');
    });
  };

})();

