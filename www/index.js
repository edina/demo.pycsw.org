/*var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(__dirname)); //  "public" off of current is root

app.listen(8070);
console.log('Listening on port 8070');*/

var getCapabilitiesFromRequest = function (url) {
  console.log(url);
  var TOKEN = "GetCapabilities=";
  var len = url.lastIndexOf(TOKEN) + TOKEN.length;
  console.log(len);
  if(len !== -1){
    return url.substring(len);
  } else {
    console.log("error with GetCapabilities url");
  }
};

var defaultPort = 8070;
var defaultCswUrl = 'http://localhost:8000';
var argv = require('minimist')(process.argv.slice(2));
if (argv['h']) {
  console.log("Help");
  console.log("-p arg the port to serve the www directory");
  console.log("-c arg the url of the pycsw server.");
  console.log("-t arg to run the unit tests");
  console.log("example ...");
  console.log("node index.js -p 8070 -c 'http://localhost:8000/csw'");
  return;
}




var port = argv['p'];
var cswUrl = argv['c'];

port = port || defaultPort;
cswUrl = cswUrl || defaultCswUrl;


if (argv['t']) {

  var open = require('open');
  open('http://localhost:' + port + '/viewer/tests.html');
  return;
}

var express = require('express');
var request = require('request');
var path = require('path');
var app = express();

app.use('/pycsw-wsgi', function (req, res) {
  var url = cswUrl + req.url;
  console.log(url);
  var reqError = function (error, response, body) {
    if (error) {
      console.log(error);
    }
  };
  req.pipe(request(url, reqError)).pipe(res);
});

app.use('/GetCapabilities*', function (req, res) {
  console.log("req");
  console.log(req);

  var getCapabilitiesUrl = getCapabilitiesFromRequest(req.baseUrl);
  
  console.log(getCapabilitiesUrl);
  var reqError = function (error, response, body) {
    if (error) {
      console.log(error);
    }
  };
  req.pipe(request(getCapabilitiesUrl, reqError)).pipe(res);
});

app.use(express.static(__dirname));


app.listen(port);
console.log('Listening on port ' + port + ' using csw at ' + cswUrl);