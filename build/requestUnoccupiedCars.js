var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
var Booking = require("./models/booking_model.js");
var _ = require("underscore");
var Global = require("./global.js");
require("./config.js");

exports.unoccupiedCars = [];

exports.requestUnoccupiedCars = function(req, res) {

  var that = this;

  console.log(Global.parseQueryDate(req.body.queryDate))
  Booking.find({
    date: Global.parseQueryDate(req.body.queryDate)
  }).select({'car_id': 1})
    .exec(function(err, bookings) {

    var occupiedCarIds = [];
    if(err || !bookings) {
      res.send("Error");
    } else {
      occupiedCarIds = _.pluck(bookings, 'car_id');
      that.getCarInfo(res, occupiedCarIds);
    }
  });

};

exports.getCarInfo = function(res, occupiedCarIds) {

  Car.find({
    _id: {$nin: occupiedCarIds},
    state: {$ne: "O"}
  }).select().exec(function(err, cars) {

    if(err || !cars || cars.length === 0) {
      res.send("No car found");
    } else {
      
      res.send(cars);

    };
  });
};