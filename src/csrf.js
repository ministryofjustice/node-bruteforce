var request = require('request');
var logger  = require('./logger.js');

module.exports = function(config, onSuccess, onFail) {

  var module = {};

  // Public Variables

  module.tokenPool = [];

  // Public Methods

  module.fetch = function(callback) {
    var sample = module.tokenPool.pop();

    if (sample) {
      callback(sample.token, sample.cookie);
    } else {
      requestFromTarget(callback);
    }
  };

  module.collect = function(response, body, csrfRegex, callback) {
    var cookieString = response.headers['set-cookie'] || '';
    var capture      = body.match(new RegExp(csrfRegex));

    if (!capture) {

      logger.error('CSRF token not found');
      logger.info('Debug info:\n');
      logger.info(body);
      onFail();

    }

    callback(capture[1], cookieString);
  };

  // Private Methods

  function requestFromTarget(callback) {
    var reqConfig = config.getAdvanced();

    request(reqConfig.csrf, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        
        module.collect(
          response, 
          body, 
          reqConfig.capture.csrfRegex, 
          callback
        );

      } else {
        
        logger.warn('Server responded with: ' + response.statusCode);
        onFail();

      }
    });
  }

  return module;
};