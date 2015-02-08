var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
require("./config.js");

exports.updateCar = function(req, res) {

  var that = this;
  
  Car.find({
    "_id": req.body.carId
  }).exec(function(err, cars) {

    var output = [];
    if(err || !cars || cars.length === 0) {
      console.log("No Car Found");
      res.send("No Car Found");
    } else {
      var oldState = cars[0].state;
      var nextState = "";
      
      if (oldState === "O") {
        nextState = "OP";
      } else if (oldState === "OP") {
        nextState = "U";
      } else if (oldState === "U") {
        nextState = "UP";
      } else if (oldState) {
        nextState = "O"
      }
      
      that.updateState(req, nextState);
      res.send("foo");
    };
  });
  
  
};

exports.updateState = function(req, nextState) {
  Car.update({
      "_id": req.body.carId
    }, {
      "_id": req.body.carId,
      state: nextState
    }, {
      upsert: true
    },
    function(err, doc) {
    });
};