var attack         = require('./attack.js');
var configBuilder  = require('./configBuilder.js');
var inputValidator = require('./inputValidator.js');
var programBuilder = require('./programBuilder.js');
var logger         = require('./logger.js');

// ================================================================================================
//  Main
// ================================================================================================

function run(cliArgs) {

  // Create the program object
  var program = programBuilder.fromArgs(cliArgs);

  // Check all options passed make sense
  inputValidator.checkAll(program);

  // Create the configuration
  var opt = {
    username:    program.username,
    wordlist:    program.wordlist,
    target:      program.target,
    concurrency: parseInt(program.numRequests),
    configFile:  program.config,
    type:        program.type
  };

  logger.info('Parsing configuration');
  
  var config = configBuilder.fromOptions(opt);

  // Launch the attack
  logger.info('Starting bruteforce...');

  function exitSuccess() {
    process.exit(0);
  }

  function exitError() {
    process.exit(1);
  }
  
  attack.launch(
    config,
    exitSuccess,
    exitError
  );
}

exports.run = run;
