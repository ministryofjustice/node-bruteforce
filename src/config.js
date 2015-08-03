var fs = require('fs');
//
// Build an attack configuration from an options object
//
function Config(options) {
  var raw = fs.readFileSync(options.configFile, 'utf-8');

  raw = gsub(raw, this.ANCHORS.user, options.username);
  raw = gsub(raw, this.ANCHORS.url, options.target);

  this.raw = raw;  
}

Config.prototype.ANCHORS = {
  user:   '%USER%',
  pass:   '%PASS%',
  url:    '%URL%',
  token:  '%TOKEN%',
  cookie: '%COOKIE%'
};

Config.prototype.generate = function() {
  return JSON.parse(this.raw);
};

Config.prototype.setPassword = function(password) {
  this.raw = gsub(raw, this.ANCHORS.pass, password);
};

Config.prototype.setCookie = function(cookie) {
  this.raw = gsub(raw, this.ANCHORS.cookie, cookie);
};

Config.prototype.setToken = function(token) {
  this.raw = gsub(raw, this.ANCHORS.token, token);
};

module.exports = Config;

// ================================================================================================
// ================================================================================================

function gsub(sTarget, sFind, sReplace) {
  var reFind = new RegExp(sFind, 'g');

  return sTarget.replace(reFind, sReplace);
};
