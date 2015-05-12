
// lib/checkers/harvest.js - getharvest.com status check
module.exports = (function() {

  var request = require('request');

  return function harvest(callback) {
    request('http://kccljmymlslr.statuspage.io/api/v2/status.json', function(e, resp, body) {
      if (e) return callback(e);
      if (!resp || resp.statusCode !== 200) return callback(new Error("Status not 200: " + require('util').inspect(body)));

      if (typeof body === 'string') body = JSON.parse(body);
      var status = body.status;
      callback(null, status.indicator == 'none', status.description);
    });
  };

})();
