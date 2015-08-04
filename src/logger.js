var winston = require('winston');

// ================================================================================================
// Build a custom logger for production and test
// ================================================================================================

winston.emitErrs = true;

var productionLogger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './log/production.log',
      handleExceptions: true,
      json: true,
      maxsize: 1048576, //1MB
      maxFiles: 1,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

var testLogger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: './log/test.log',
      handleExceptions: true,
      json: true,
      maxsize: 1048576, //1MB
      maxFiles: 1,
      colorize: false
    })
  ],
  exitOnError: false
});

function logger() {
  if (process.env.NODE_ENV === 'test') {
    return testLogger;
  } else {
    return productionLogger;
  }
}

module.exports = (logger());
