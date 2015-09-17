var request = require('request');
var logger  = require('./logger.js');

// ================================================================================================
// Handle collecting and storing CSRF tokens
// ================================================================================================

module.exports = function(config, onSuccess, onError) {

  var module = {};

 // ================================================================================================
 // Public API
 // ================================================================================================
  
  module.pool = [];

  module.fetch = function(callback) {
    var sample = module.pool.pop();

    if (sample) {
      callback(sample.token, sample.cookie);
    } else {
      requestFromTarget(callback);
    }
  };

  module.extractFromResponse = function(response, body, csrfRegex, callback) {
    var cookieString = response.headers['set-cookie'] || '';
    var capture      = body.match(new RegExp(csrfRegex));

    if (!capture) {

      logger.error('CSRF token not found');
      logger.info('Debug info:\n');
      logger.info(body);
      onError();

    }

    callback(capture[1], cookieString);
  };

  // ================================================================================================
  // Private
  // ================================================================================================

  function requestFromTarget(callback) {
    var reqConfig = config.getAdvanced();

    request(reqConfig.csrf, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        
        module.extractFromResponse(
          response, 
          body, 
          reqConfig.capture.csrfRegex, 
          callback
        );

      } else {
        
        logger.warn('Server responded with: ' + response.statusCode);
        onError();

      }
    });
  }

  return module;
};