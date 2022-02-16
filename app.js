var express = require('express');
var http = require('http');
var config = require('config').get('webServer');
var app = express();

try {
  require('./settings/database').configure(app);
  require('./settings/express').configure(app);
  require('./settings/routes').configure(app);
}
 catch(err){
  console.log(err);
}

var server = http.createServer(app);
// console.log('environment:' + process.env.NODE_ENV);

server.listen(config.port, function () {
  console.log('listening on port:' + config.port);
});

module.exports = app;
