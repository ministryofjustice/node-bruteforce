var expect = require('expect.js');
var sinon  = require('sinon');
var attack = require('../src/attack.js');
var Config  = require('../src/config.js');

describe('Command line interface', function() {
  beforeEach(function() {
    sinon.stub(attack, 'launch');
  });

  describe('usage', function() {
    var spy = sinon.spy(process, 'Config');

    it('should launch an attack with the supplied paramters', function() {
      process.exec('node-bruteforce -u root -w words.txt -t http://dvwa.org -N 35 -T rails');

      expect(spy).to.have.been.calledWith({
        username:    'root',
        wordlist:    'words.txt',
        target:      'http://dvwa.org',
        concurrency: 35,
        configFile:  undefined,
        type:        'rails'
      });
      expect(attack.launch).to.have.been.calledWith(config);
    });

    it('should display the help menu if no commands are passed', function() {

    });
  });

  describe('validation', function() {
    it('should check user, wordlist and target are all provided', function() {

    });

    it('should check that either a config file or framework are provided', function() {

    });

    it('should check that a config file and framework have not both been provided', function() {

    });
  });
});