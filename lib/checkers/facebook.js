
// lib/checkers/facebook.js - facebook.com status check
module.exports = (function() {

  var process = require('child_process');

  return function facebook(callback) {
    // Facebook does some stupid browser sniffing on its status page so if our request
    // does not match its profile we'll get redirected to an /unsupportedbrowser page.
    // So we fallback to something that will definitely works: curl-ing.
    process.exec('curl -s https://www.facebook.com/feeds/api_status.php', function(e, stdout, stderr) {
      if (e) return callback(e)

      body = JSON.parse(stdout)
      callback(null, body.current && body.current.health, body.current && body.current.subject || '(no message)');
    });
  };

})();
