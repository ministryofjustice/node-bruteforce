
var expect        = require('expect.js');
var sinon         = require('sinon');
var attack        = require('../src/attack.js');
var configBuilder = require('../src/configBuilder.js');
var logger        = require('../src/logger.js');

describe('Attack', function() {
  var config = configBuilder.fromOptions({
    username: 'root',
    wordlist: 'test/resources/words.txt',
    target: 'http://localhost:9000',
    concurrency: 1,
    configFile: 'test/resources/sampleConfig.json'
  });
  var msgSpy;
  var errSpy;

  beforeEach(function() {
    msgSpy = sinon.spy(logger, 'info');
    errSpy = sinon.spy(logger, 'error');
    sinon.stub(process, 'exit');
  });
  
  afterEach(function() {
    process.exit.restore();
    msgSpy.restore();
    errSpy.restore();
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

    it('should display an error if a CSRF token is not found', function() {
      attack.launch(config, function() {
        sinon.assert.calledWithMatch(msgSpy, /invalid: notpassword/i);
        done();
      });
    });

    it('should display a warning if server responds with non-success code', function() {
     
    });
  });
});