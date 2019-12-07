const fs = require('fs');
var http = require('http');

http.createServer(function (req, res) {
  res.write('no');
  res.end();
}).listen(8080);
