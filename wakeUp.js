var http = require('http');

http.createServer(function (req, res) {
  res.write('./ougi.html');
  res.end();
}).listen(8080);
