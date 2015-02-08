var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var requestFleet = require('./build/requestFleet.js');
var insertCar = require('./build/insertCar.js');
var requestCar = require('./build/requestCar.js');
var updateCar = require('./build/updateCar.js');
var insertBooking = require('./build/insertBooking.js');
var requestUnoccupiedCars = require('./build/requestUnoccupiedCars.js');
var insertReservation = require('./build/insertReservation.js');

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

site.get('/insertBooking', function(req, res) {
  insertBooking.insertBooking(req, res);
});

site.get('/requestUnoccupiedCars', function(req, res) {
  requestUnoccupiedCars.requestUnoccupiedCars(req, res);
});

site.get('/insertReservation', function(req, res) {
  insertReservation.insertReservation(req, res);
});

site.get('/executeReservation', function(req, res) {
  insertReservation.executeReservation(req, res);
});

var httpServer = http.createServer(site);

httpServer.listen(9401);

module.exports = site;