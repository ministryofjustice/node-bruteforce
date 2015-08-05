var expect    = require('expect.js');
var sinon     = require('sinon');
var validator = require('../src/inputValidator.js');
var logger    = require('../src/logger.js');

describe('Input Validation', function() {
  var msgSpy;
  var dblProgram;

  beforeEach(function() {
    dblProgram = {
      rawArgs: [
        'node',
        'run',
        'options'
      ],
      username: 'root',
      wordlist: 'words.txt',
      target: 'http://dvwa.org',
      type: 'rails',
      help: sinon.spy()
    };

    msgSpy = sinon.spy(logger, 'error');
  });

  afterEach(function() {
    msgSpy.restore();
  });

  describe('#checkAll', function() {
    it('should display the help menu if the program is called with no args', function() {
      dblProgram.rawArgs = [ 'node', 'run'];

      validator.checkAll(dblProgram);
      
      sinon.assert.calledOnce(dblProgram.help);
    });

    it('should display a message if the required arguments are not passed', function() {
      delete dblProgram.username;

      validator.checkAll(dblProgram);
      
      sinon.assert.calledOnce(dblProgram.help);
      sinon.assert.calledWithMatch(msgSpy, /required arguments/i);
    });

    it('should display a message if BOTH config file and framework are passed', function() {
      dblProgram.config = 'config.json';
      validator.checkAll(dblProgram);
      
      sinon.assert.calledOnce(dblProgram.help);
      sinon.assert.calledWithMatch(msgSpy, /overwrite the target framework/i);
    });

    it('should display a message if NEITHER config file and framework are passed', function() {
      delete dblProgram.type;

      validator.checkAll(dblProgram);
      
      sinon.assert.calledOnce(dblProgram.help);
      sinon.assert.calledWithMatch(msgSpy, /framework or provide a config file/i);
    });

    it('should not display anything otherwise', function() {
      validator.checkAll(dblProgram);

      sinon.assert.neverCalledWithMatch(dblProgram.help, /.*/);
      sinon.assert.neverCalledWithMatch(msgSpy, /.*/);
    });
  });
});