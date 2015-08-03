#! /usr/bin/env node

// Module Dependencies
var program    = require('commander');
// var bruteforce = require('./src/bruteforce.js');

// Define option switches
program
  .version('1.0.0')
  .description('NodeJS HTTP(S) Login Form Bruteforcer')
  .option('-u, --username <string>', 'login username')
  .option('-w, --wordlist <file>', 'dictionary file')
  .option('-t, --target <url>', 'target sign in url')
  .option('-N, --num-requests [n]', 'maximum concurrent requests (default 25)', 25)
  .option('-T, --type [framework]', 'specify target framework', /^(rails|django)$/i, false)
  .option('-c, --config [file]', 'custom .json config file')

// Add examples to help menu
program.on('--help', function() {
  console.log('  Examples:\n');
  console.log('    $ ./run.js -u root -w words.txt -t http://localhost:8000/admin/login -N 50 -T django');
  console.log('    $ ./run.js -u admin@rails.com -w words.txt -t http://localhost:3000/users/sign_in -N 50 -T rails\n');
});

program.parse(process.argv);

// Display help if no arguments passed
if (!process.argv.slice(2).length) {
  program.help();
}

// Check all required args present
if ( !program.username || !program.wordlist || !program.target) {
  console.log('\n  Ensure all required arguments are provided');
  program.help();
}

// Don't allow a framework choice and a custom config file
if (program.type && program.config) {
  console.log('\n  Selecting a custom config file will overwrite the target framework choice');
  program.help();
}

// Require either a framework choice or config file
if (!program.type && !program.config) {
  console.log('\n  Select either a supported framework or provide a config file');
  program.help();
}

// =====================================================================
//  MAIN ===============================================================
// =====================================================================

console.log('[+] Starting bruteforce...')
// parse config file

// bruteforce.start(config);

