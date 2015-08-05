var expect        = require('expect.js');
var sinon         = require('sinon');
var application   = require('../src/application.js');
var attack        = require('../src/attack.js');
var configBuilder = require('../src/configBuilder.js');

describe('Application', function() {
  var attackStub;

  beforeEach(function() {
    attackStub = sinon.stub(attack, 'launch');
  }); 

  afterEach(function() {
    attackStub.restore();
  });

  describe('usage', function() {
    it('should launch an attack with the supplied paramters', function() {
      var args = 
        'node run -u root -w words.txt -t http://dvwa.org -N 35 -T rails'
          .split(' ');
      var configSpy = sinon.spy(configBuilder, 'fromOptions');

      application.run(args);
      
      sinon.assert.calledWith(configSpy, {
        username:    'root',
        wordlist:    'words.txt',
        target:      'http://dvwa.org',
        concurrency: 35,
        configFile:  undefined,
        type:        'rails'
      });
      sinon.assert.calledOnce(attackStub);
    });
  });
});