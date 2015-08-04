var fs   = require('fs');
var path = require('path');
//
// Build an attack configuration from an options object
//
function Config(options) {
  var path = this.getSource(options.type, options.configFile);
  var raw  = fs.readFileSync(path, 'utf-8');

  raw = gsub(raw, this.ANCHORS.user, options.username);
  raw = gsub(raw, this.ANCHORS.url, options.target);

  this.rawAdvanced = raw;
  this.wordlist    = options.wordlist;
  this.concurrency = options.concurrency; 
}

Config.prototype.ANCHORS = {
  user:   '%USER%',
  pass:   '%PASS%',
  url:    '%URL%',
  token:  '%TOKEN%',
  cookie: '%COOKIE%'
};

Config.prototype.FRAMEWORKS = {
  rails:  'railsDevise.json',
  django: 'djangoAdmin.json'
};

Config.prototype.CONFIG_PATH = 'config/frameworks';

Config.prototype.getSource = function(type, file) {
  if (file) {
    return file;
  } else {
    return path.join(this.CONFIG_PATH, this.FRAMEWORKS[type]);
  }
};

Config.prototype.getAdvanced = function() {
  return JSON.parse(this.rawAdvanced);
};

Config.prototype.getLogin = function(password, token, cookie) {
  var raw = this.rawAdvanced;

  raw = gsub(raw, this.ANCHORS.pass, password);
  raw = gsub(raw, this.ANCHORS.token, token);
  raw = gsub(raw, this.ANCHORS.cookie, cookie);

  return JSON.parse(raw).login;
};

module.exports = Config;

// ================================================================================================
// ================================================================================================

function gsub(sTarget, sFind, sReplace) {
  var reFind = new RegExp(sFind, 'g');

  return sTarget.replace(reFind, sReplace);
}
