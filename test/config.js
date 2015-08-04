var path   = require('path');
var expect = require('expect.js');
var sinon  = require('sinon');
var Config = require('../src/config.js');

describe('Config', function() {
  var options;
  var config;

  beforeEach(function() {
    options = {
      username:    'root',
      wordlist:    'words.txt',
      target:      'http://dvwa.org',
      concurrency: 25,
      configFile:  'test/resources/sampleConfig.json'
    };

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
      expect(config.getSource('', options.configFile)).to.eql(options.configFile);
    });

    it('should return the appropriate framework path if one is selected', function() {
      var railsOptions  = options;
      railsOptions.type = 'rails';
      delete railsOptions.configFile;

      var railsConfig = new Config(railsOptions);

      expect(railsConfig.getSource('rails')).to.eql(
        path.join(
          railsConfig.CONFIG_PATH,
          railsConfig.FRAMEWORKS.rails
        )
      );
    });
  });

  describe('#getAdvanced', function() {
    it('should return a config JSON object', function() {
      expect(config.getAdvanced().csrf.url).to.eql(options.target);
      expect(config.getAdvanced().login.url).to.eql(options.target);
    });
  });

  describe('#getLogin', function() {
    it('should return a config JSON object update with login fields', function() {
      var loginConfig = config.getLogin('pass', 'token', 'cookie');

      expect(loginConfig.form.password).to.eql('pass');
      expect(loginConfig.form.authenticity_token).to.eql('token');
      expect(loginConfig.headers.Cookie).to.eql('cookie');
    });
  });
});