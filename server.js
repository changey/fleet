var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var requestFleet = require('./build/requestFleet.js')

var site = express();
//site.use(express.static(__dirname + '/..'));
site.use(express.static(__dirname + '/css/..'));
site.use(bodyParser.urlencoded({
  extended: true
}));
site.use(bodyParser.json());

site.get("/", function(req, res) {
  fs.createReadStream("./index.html").pipe(res);
});

site.get('/requestFleet', function(req, res) {
  requestFleet.requestFleet(req, res);
});

var httpServer = http.createServer(site);

httpServer.listen(9401);

module.exports = site;