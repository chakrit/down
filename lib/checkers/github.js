
// lib/checkers/github.js - github.com status check
module.exports = (function() {

  var request = require('request');

  return function github(callback) {
    request('https://status.github.com/api/last-message.json', function(e, resp, body) {
      if (e) return callback(e)
      if (!resp || resp.statusCode !== 200) return callback(new Error("Status site response code is not 200."));

      if (typeof body === 'string') body = JSON.parse(body);
      callback(null, body.status === 'good', body.body || '(no message)');
    });
  };

})();
