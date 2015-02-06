var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var requestFleet = require('./build/requestFleet.js');
var insertCar = require('./build/insertCar.js');
var requestCar = require('./build/requestCar.js');
var updateCar = require('./build/updateCar.js');

require("./build/config.js")

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

site.get('/insertCar', function(req, res) {
  insertCar.insertCar(req, res);
});

site.get('/requestCar', function(req, res) {
  requestCar.requestCar(req, res);
});

site.post('/updateCar', function(req, res) {
  updateCar.updateCar(req, res);
});

var httpServer = http.createServer(site);

httpServer.listen(9401);

module.exports = site;