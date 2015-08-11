
// lib/checkers/github.js - github.com status check
module.exports = (function() {

  var request = require('request')
    , cheerio = require('cheerio');

  return function docker(callback) {
    request('https://status.docker.com', function(e, resp, body) {
      if (e) return callback(e)
      if (!resp || resp.statusCode !== 200) return callback(new Error("Status site response code is not 200."));
      if (typeof body !== 'string') body += '';

      var opts = { normalWhitespace: true, decodeEntities: true }
        , doc = cheerio.load(body, opts);

      var title = doc('#statusbar_text').text();
      title = (typeof title === 'string' && title.length) ? title : doc('div.panel-title>h5>a').text();

      callback(null, /All Systems Operational/i.test(title), title);
    });
  };

})();
