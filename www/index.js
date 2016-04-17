/*var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(__dirname)); //  "public" off of current is root

app.listen(8070);
console.log('Listening on port 8070');*/
var express = require('express');
var request = require('request');
var path = require('path');
var app = express();
var apiUrl = 'http://localhost:8000'
app.use('/pycsw-wsgi', function(req, res) {
  var url = apiUrl + req.url;
  req.pipe(request(url)).pipe(res);
});

app.use(express.static(__dirname));


app.listen(8070);
console.log('Listening on port 8070');