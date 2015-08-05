
var expect        = require('expect.js');
var sinon         = require('sinon');
var attack        = require('../src/attack.js');
var configBuilder = require('../src/configBuilder.js');
var logger        = require('../src/logger.js');

describe('Attack', function() {
  var msgSpy = sinon.spy(logger, 'info');
  // var errSpy = sinon.spy(logger, 'error');
  var config = configBuilder.fromOptions({
    username: 'root',
    wordlist: 'test/resources/words.txt',
    target: 'http://localhost:9000',
    concurrency: 1,
    configFile: 'test/resources/sampleConfig.json'
  });

  beforeEach(function() {
    sinon.stub(process, 'exit');
  });
  
  afterEach(function() {
    process.exit.restore();
    msgSpy.reset();
  });

  describe('#launch', function() {
    it('should display a found password', function(done) {
      attack.launch(config, function() {
        sinon.assert.calledWithMatch(msgSpy, /found/i);
        done();
      });
    });

    it('should display an invalid password attempt', function() {

    });

    it('should display an error if a CSRF token is not found', function() {

    });

    it('should display a warning if server responds with non-success code', function() {

    });
  });
});