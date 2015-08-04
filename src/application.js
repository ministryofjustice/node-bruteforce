var program       = require('commander');
var attack        = require('./attack.js');
var configBuilder = require('./configBuilder.js');

function run(cliArgs) {

  // Define option switches
  program
    .version('1.0.0')
    .usage('-u <username> -w <wordlist> -t <target> [options]')
    .description('NodeJS HTTP(S) Login Form Bruteforcer')
    .option('-u, --username <string>', 'login username')
    .option('-w, --wordlist <file>', 'dictionary file')
    .option('-t, --target <url>', 'target sign in url')
    .option('-N, --num-requests [n]', 'maximum concurrent requests (default 25)', 25)
    .option('-T, --type [framework]', 'specify target framework', /^(rails|django)$/i, false)
    .option('-c, --config [file]', 'custom .json config file');

  // Add examples to help menu
  program.on('--help', function() {
    console.log('  Examples:\n');
    console.log(
      '    $ ./run.js -u root -w words.txt -N 50' + 
      '-t http://localhost:8000/admin/login -T django'
    );
    console.log(
      '    $ ./run.js -u admin@rails.com -w words.txt -N 35 ' + 
      '-t http://localhost:3000/users/sign_in -T rails'
    );
    console.log(
      '    $ ./run.js -u root -w words.txt' + 
      '-t http://dvwa/login -c config/dvwa.json\n'
    );
  });

  program.parse(cliArgs);

  function validate(condition, message) {
    if (!condition) {
      if (message) console.log('\n  ' + message);
      program.help();
    }
  }

  // Display help if no arguments passed
  validate(cliArgs.slice(2).length);

  // Check all required args present
  validate(
    (program.username || program.wordlist || program.target),
    'Ensure all required arguments are provided (user, wordlist, url)'
  );

  // Don't allow a framework choice and a custom config file
  validate(
    !(program.type && program.config),
    'Selecting a custom config file will overwrite the target framework choice'
  );

  // Require either a framework choice or config file
  validate(
    (program.type || program.config),
    'Select either a supported framework or provide a config file'
  );

  // =====================================================================
  //  MAIN ===============================================================
  // =====================================================================

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

  console.log('[+] Starting bruteforce...');
  attack.launch(config);
}

exports.run = run;
