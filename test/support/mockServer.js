// ================================================================================================
//
// Mini web application implementing a login to attack
//
// Serves URLs: 
//  -> http://localhost:9000/csrf 
//  -> http://localhost:9000/non-existent/csrf
//  -> http://localhost:9000/login
//
// ================================================================================================
//
var http        = require('http');
var url         = require('url');
var querystring = require('querystring');
var crypto      = require('crypto');
//
// Config
//
var USERNAME = 'root';
var PASSWORD = 'password';
var PORT     = 9000;
var TOKENS   = [];
//
// Server
//
var httpServer = (function() {
  var module = {};

  module.start = function(route, handle) {
    function onRequest(req, res) {
      var pathname = url.parse(req.url).pathname;

      route(handle, pathname, req, res);
    }

    http
      .createServer(onRequest)
      .listen(PORT);
  };

  return module;

} ());
//
// Routes
//
var Router = (function() {
  var module = {};

  module.route = function(handle, pathname, req, res) {
    if (typeof handle[pathname] === 'function') {
      handle[pathname] (req, res);
    } else {
      handle['404'] (req, res);
    }
  };

  return module;

} ());
// 
// Request Handling 
//
var RequestHandler = (function() {
  var module = {};

  module.notFound = function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('[-] 404 NOT FOUND');
    res.end();
  };

  module.csrf = function(req, res) {
    var token = generateToken();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('[+] token=' + token);
    res.end();
  };

  module.noCsrf = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('[-] No token here');
    res.end();
  };

  module.login = function(req, res) {
    var postData = '';

    req.on('data', function(data) {
      postData += data;
    });

    req.on('end', function() {
      var data = querystring.parse(postData);

      if (TOKENS.indexOf(data.authenticity_token) === -1) {
        serverError(res);
      } else if (data.user === USERNAME && data.password === PASSWORD) {
        allowed(res);
      } else {
        denied(res);
      }
    });
  };
  //
  // Private
  //
  function serverError(res) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('[-] Invalid token');
    res.end();
  }

  function allowed(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Welcome legitimate user');
    res.end();
  }

  function denied(res) {
    var token = generateToken();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Bad login');
    res.write('[+] token=' + token);
    res.end();
  }

  function generateToken() {
    var token = crypto.randomBytes(8).toString('hex');

    TOKENS.push(token);
    
    return token;
  }

  return module;

} ());
//
// Main
//
console.log('[+] Starting mini web application on port ' + PORT);

var handle = {};

handle['/csrf']              = RequestHandler.csrf;
handle['/non-existent/csrf'] = RequestHandler.noCsrf;
handle['/login']             = RequestHandler.login;
handle['404']                = RequestHandler.notFound;

httpServer.start(Router.route, handle);