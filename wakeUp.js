const fs = require('fs');
var http = require('http');
var html = fs.readFileSync('./ougi.html')

http.createServer(function (req, res) {
  res.write(html);
  res.end();
}).listen(8080);
