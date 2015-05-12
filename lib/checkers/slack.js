
// lib/checkers/slack.js - slack.com status check
module.exports = (function() {

  var request = require('request')
    , cheerio = require('cheerio');

  return function slack(callback) {
    request('https://status.slack.com', function(e, resp, body) {
      if (e) return callback(e)
      if (!resp || resp.statusCode !== 200) return callback(new Error("Status site response code is not 200."));
      if (typeof body !== 'string') body += '';

      var opts = { normalWhitespace: true, decodeEntities: true }
        , doc = cheerio.load(body, opts)
        , state = doc('.current_status>h1').text();

      callback(null, /All's good/.test(state), state);
    });
  };

})();
