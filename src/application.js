var attack         = require('./attack.js');
var configBuilder  = require('./configBuilder.js');
var validator      = require('./validator.js');
var programBuilder = require('./programBuilder.js');

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

  console.log('[+] Parsing configuration');
  var config = configBuilder.fromOptions(opt);

  // Launch the attack
  console.log('[+] Starting bruteforce...');
  attack.launch(config);
}

exports.run = run;
