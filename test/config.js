var expect = require('expect.js');
var sinon  = require('sinon');
var Config = require('../src/config.js');

describe('Config', function() {
  var options = {
    username:    'root',
    wordlist:    'words.txt',
    target:      'http://dvwa.org',
    concurrency: 25,
    configFile:  'test/resources/sampleConfig.json'
  };
  var config;

  beforeEach(function() {
    config = new Config(options);
  });

  describe('#new', function() {
    it('should set the wordlist', function() {
      expect(config.wordlist).to.eql(options.wordlist);
    });

    it('should set the concurrency', function() {
      expect(config.concurrency).to.eql(options.concurrency);
    });

    it('should updated raw config with known parameters', function() {
      expect(config.rawAdvanced).to.match(/\"url\": \"http:\/\/dvwa\.org\"/);
      expect(config.rawAdvanced).to.match(/\"user\": \"root\"/);
    });
  });

  describe('#getSource', function() {
    it('should return the config file if one is set', function() {

    });

    it('should return the appropriate framework path if one is selected', function() {

    });
  });

  describe('#getAdvanced', function() {
    it('should return a config JSON object', function() {

    });
  });

  describe('#getLogin', function() {
    it('should return a config JSON object update with login fields', function() {

    });
  });
});