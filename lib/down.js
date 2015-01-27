#!/usr/bin/env node

// lib/down.js - Main CLI entrypoint
(function() {

  var abbrev = require('abbrev')
    , request = require('request')
    , optimist = require('optimist')
    , colors = require('colors');

  var checkers = require('./checkers')
    , services = Object.keys(checkers)
    , abbr = abbrev(services)
    , immediate = typeof setImmediate === 'function' ? setImmediate : process.nextTick;

  abbr.gh = 'github';
  abbr.hv = 'harvest';
  abbr.ci = 'circleci';
  abbr.fb = 'facebook';

  var argv = optimist
    .usage('Usage: down [service]\n\nSupported Services:\n' + services.join('\n'))
    .options('i',
      { alias: 'interval'
      , describe: 'Status polling interval in milliseconds.'
      , default: 1000 }
    )
    .demand(1)
    .argv;

  argv._.forEach(function start(service) {
    if (!(service in abbr)) {
      console.error("Unknown service: " + service);
      return false;
    }

    service = abbr[service];

    var checker = checkers[service];
    immediate(function checkOnce() {
      checker(function(e, result, message) {
        var tag = false;
        if (!tag && e) tag = '  ERR '.red;
        if (!tag && isNaN(result)) tag= '  ??? '.yellow;
        if (!tag && result) tag = '   UP '.green;
        if (!tag) tag = ' DOWN '.red;

        message = e && e.message || message;
        console.log(tag + '[' + service + '] ' + message);
        setTimeout(checkOnce, argv.interval);
      });
    });
  });

})();

