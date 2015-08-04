var logger = require('./logger.js');

// ================================================================================================
// Validate options passed to program via interface
// ================================================================================================

function checkAll(program) {

  function check(condition, message) {
    if (!condition) {
      if (message) logger.error(message);
      program.help();
    }
  }

  // Display help if no arguments passed
  check(program.rawArgs.slice(2).length);

  // Check all required args present
  check(
    (program.username && program.wordlist && program.target),
    'Ensure all required arguments are provided (user, wordlist, url)'
  );

  // Don't allow a framework choice and a custom config file
  check(
    !(program.type && program.config),
    'Selecting a custom config file will overwrite the target framework choice'
  );

  // Require either a framework choice or config file
  check(
    (program.type || program.config),
    'Select either a supported framework or provide a config file'
  );
}

exports.checkAll = checkAll;