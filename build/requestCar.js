var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
require("./config.js");

exports.requestCar = function(req, res) {

  var outputJson = '';
  Car.find().sort({
    state: 1
  }).exec(function(err, cars) {

    if(err || !cars || cars.length === 0) {
      res.send("No Car Found");
    } else {
      outputJson = JSON.stringify(cars, null, ' ');
      res.send(outputJson);
    };
  });
}