var http = require('http');
var options = ["hi", "ohayou", "baka", "hey there!", "ola bb", "Ougi joins the battle!", "Creeper. \nAw man"];
var response = options[Math.floor(Math.random()*options.length)];

http.createServer(function (req, res) {
  res.write(response);
  res.end();
}).listen(8080);
