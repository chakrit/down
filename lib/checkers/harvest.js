
// lib/checkers/harvest.js - getharvest.com status check
module.exports = (function() {

  var request = require('request');

  return function harvest(callback) {
    request('http://harveststatus.com/status.json', function(e, resp, body) {
      if (e) return callback(e);
      if (!resp || resp.statusCode !== 200) return callback(new Error("Status not 200."));

      if (typeof body === 'string') body = JSON.parse(body);
      callback(null, body.status === 'up',
        'last response time: ' + body['last_response_time']);
    });
  };

})();
