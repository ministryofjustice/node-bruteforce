var attack         = require('./attack.js');
var configBuilder  = require('./configBuilder.js');
var validator      = require('./validator.js');
var programBuilder = require('./programBuilder.js');
var logger         = require('./logger.js');

// ================================================================================================
//  Main
// ================================================================================================

function run(cliArgs) {

  // Create the program object
  var program = programBuilder.fromArgs(cliArgs);

  // Check all options passed make sense
  validator.checkAll(program);

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
  attack.launch(config);
}

exports.run = run;
