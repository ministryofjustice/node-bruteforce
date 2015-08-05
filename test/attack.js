
var expect        = require('expect.js');
var sinon         = require('sinon');
var attack        = require('../src/attack.js');
var configBuilder = require('../src/configBuilder.js');
var logger        = require('../src/logger.js');

describe('Attack', function() {
  var opt = {
    username: 'root',
    wordlist: 'test/resources/words.txt',
    target: 'http://localhost:9000',
    concurrency: 1,
    configFile: 'test/resources/sampleConfig.json'
  };
  var config = configBuilder.fromOptions(opt);
  var msgSpy;
  var errSpy;
  var warnSpy;

  beforeEach(function() {
    msgSpy = sinon.spy(logger, 'info');
    errSpy = sinon.spy(logger, 'error');
    warnSpy = sinon.spy(logger, 'warn');
  });
  
  afterEach(function() {
    msgSpy.restore();
    errSpy.restore();
    warnSpy.restore();
  });

  describe('#launch', function() {
    it('should display a found password', function(done) {
      attack.launch(config, function() {
        sinon.assert.calledWithMatch(msgSpy, /found/i);
        done();
      });
    });

    it('should display an invalid password attempt', function(done) {
      attack.launch(config, function() {
        sinon.assert.calledWithMatch(msgSpy, /invalid: notpassword/i);
        done();
      });
    });

    it('should display an error if a CSRF token is not found', function(done) {
      opt.target = 'http://localhost:9000/non-existent';
      var badConfig = configBuilder.fromOptions(opt);

      attack.launch(badConfig, undefined, function() {
        sinon.assert.calledWithMatch(errSpy, /csrf token not found/i);
        done();
      });
    });

    it('should display a warning if server responds with non-success code', function(done) {
      opt.target = 'http://localhost:9000/unknown';
      var badConfig = configBuilder.fromOptions(opt);

      attack.launch(badConfig, undefined, function() {
        sinon.assert.calledWithMatch(warnSpy, /server responded with: 404/i);
        done();
      });
    });
  });
});