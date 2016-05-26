/*var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(__dirname)); //  "public" off of current is root

app.listen(8070);
console.log('Listening on port 8070');*/

var defaultPort = 8070;
var defaultCswUrl = 'http://localhost:8000';
var argv = require('minimist')(process.argv.slice(2));
if (argv['h']) {
  console.log("Help");
  console.log("-p arg the port to serve the www directory");
  console.log("-c arg the url of the pycsw server.");
  console.log("example ...");
  console.log("node index.js -p 8070 -c 'http://localhost:8000/csw'");
  return;
}


var port = argv['p'];
var cswUrl = argv['c'];

port = port || defaultPort;
cswUrl = cswUrl || defaultCswUrl;

var express = require('express');
var request = require('request');
var path = require('path');
var app = express();

app.use('/pycsw-wsgi', function (req, res) {
  var url = cswUrl + req.url;
  var reqError = function (error, response, body) {
    if (error) {
      console.log(error);
    }
  };
  req.pipe(request(url, reqError)).pipe(res);
});

app.use(express.static(__dirname));


app.listen(port);
console.log('Listening on port ' + port + ' using csw at ' + cswUrl);