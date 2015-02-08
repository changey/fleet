var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
require("./config.js");

exports.requestCar = function(req, res) {

  var outputJson = '';
  Car.find().exec(function(err, cars) {

    var output = [];
    if(err || !cars || cars.length === 0) {
      res.send("No Car Found");
    } else {
      cars.forEach( function(car) {
        output.push(car);
      });
      outputJson = JSON.stringify(output, null, ' ');
      res.send(outputJson);
    };
  });
}