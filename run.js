#! /usr/bin/env node

// Module Dependencies
var request = require('request');
var fs      = require('fs');
var stream  = require('stream');
var es      = require('event-stream');
var async   = require('async');
var program = require('commander');

// Define option switches
program
  .version('1.0.0')
  .description('NodeJS HTTP(S) Login Form Bruteforcer')
  .option('-u, --username', 'login username')
  .option('-w, --wordlist', 'dictionary file')
  .option('-t, --target', 'target sign in url')
  .option('-N, --num-requests', 'maximum concurrent requests')
  .option('-T, --type <framework>', 'specify target framework (rails|django)')
  .option('-c, --config', 'custom .json config file')

// Add examples to help menu
program.on('--help', function() {
  console.log('  Examples:\n');
  console.log('    $ ./run.js -u root -w words.txt -t http://localhost:8000/admin/login -N 50 -T django');
  console.log('    $ ./run.js -u admin@rails.com -w words.txt -t http://localhost:3000/users/sign_in -N 50 -T rails\n');
});

program.parse(process.argv);

// Display help if no arguments passed
if (!program.args.length) {
  program.help();
}

// Don't allow a framework choice and a custom config file
if (program.type && program.config) {
  console.log('\n  Selecting a custom config file will overwrite the target framework choice');
  program.help();
}
