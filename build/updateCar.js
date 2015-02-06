var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
require("./config.js");

exports.updateCar = function(req, res) {

  var that = this;
  
  Car.find({
    car_id: 1
  }).exec(function(err, cars) {

    var output = [];
    if(err || !cars || cars.length === 0) {
      console.log("No Car Found");
      res.send("No Car Found");
    } else {
      console.log(cars[0].state)
      var oldState = cars[0].state;
      var nextState = "";
      
      if (oldState === "O") {
        nextState = "UP";
      } else if (oldState === "UP") {
        nextState = "U";
      } else if (oldState === "U") {
        nextState = "OP";
      } else if (oldState) {
        nextState = "O"
      }
      
      that.updateState(nextState);
      res.send("foo");
    };
  });
  
  
};

exports.updateState = function(nextState) {
  Car.update({
      car_id: 1
    }, {
      car_id: 1,
      state: nextState
    }, {
      upsert: true
    },
    function(err, doc) {
    });
};