#!/usr/bin/env node

var abbrev = require('abbrev')
  , request = require('request')
  , optimist = require('optimist')
  , colors = require('colors');


var checkers = { github: github, harvest: harvest }
  , services = Object.keys(checkers)
  , abbr = abbrev(services);

abbr.gh = 'github';
abbr.hv = 'harvest';

var targets = optimist
  .usage('Usage: down [service]\n\nSupported Services:\n' + services.join('\n'))
  .demand(1).argv._;

targets.forEach(function start(service) {
  service = abbr[service];
  if (!service) {
    console.error("Unknown service: " + service);
    return false;
  }

  var checker = checkers[service];
  setImmediate(function checkOnce() {
    checker(function(e, result, message) {
      var tag = e ? '  ERR '.red : result ? '   UP '.green : ' DOWN '.red;

      console.log(tag + '[' + service + '] ' + message);
      setTimeout(checkOnce, 1000);
    });
  });
});


function github(callback) {
  request('https://status.github.com/api/last-message.json', function(e, resp, body) {
    if (e) return callback(e)
    if (!resp || resp.statusCode !== 200) return callback(new Error("Status not 200."));

    if (typeof body === 'string') body = JSON.parse(body);
    callback(null, body.status === 'good', body.body || '');
  });
}

function harvest(callback) {
  request('http://harveststatus.com/status.json', function(e, resp, body) {
    if (e) return callback(e);
    if (!resp || resp.statusCode !== 200) return callback(new Error("Status not 200."));

    if (typeof body === 'string') body = JSON.parse(body);
    callback(null, body.status === 'up',
      'last response time: ' + body['last_response_time']);
  });
}

