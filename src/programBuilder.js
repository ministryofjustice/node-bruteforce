var program = require('commander');

// ================================================================================================
// Build a program object from a raw arguments array
// ================================================================================================

function fromArgs(args) {
  
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
      '    $ ./run.js -u root -w words.txt -N 50 ' + 
      '-t http://localhost:8000/admin -T django'
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

  program.parse(args);

  return program;
}

exports.fromArgs = fromArgs;