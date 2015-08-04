var expect        = require('expect.js');
var sinon         = require('sinon');
var attack        = require('../src/attack.js');
var configBuilder = require('../src/configBuilder.js');

describe('Command line interface', sinon.test(function() {
  var config    = { 'option': 'value' };
  var configSpy = this.stub(configBuilder, 'fromOptions').returns(config);
  var attackSpy = this.spy(attack, 'launch');

  afterEach(function() {
    configSpy.restore();
    attackSpy.restore();
  });

  describe('usage', function() {
    it('should launch an attack with the supplied paramters', function() {
      process.exec('node-bruteforce -u root -w words.txt -t http://dvwa.org -N 35 -T rails');

      expect(configSpy).to.have.been.calledWith({
        username:    'root',
        wordlist:    'words.txt',
        target:      'http://dvwa.org',
        concurrency: 35,
        configFile:  undefined,
        type:        'rails'
      });
      expect(attackSpy).to.have.been.calledWith(config);
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
}));