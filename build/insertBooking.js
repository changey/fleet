var mongoose = require("mongoose");
var Booking = require("./models/booking_model.js");
var Car = require("./models/car_model.js");
require("./config.js");

exports.insertBooking = function(req, res) {

  var that = this;
  
  Car.find().exec(function(err, cars) {

    var output = [];
    if(err || !cars || cars.length === 0) {
      res.send("No Car Found");
    } else {
      cars.forEach( function(car) {
        var date;
        for (var i =0; i < 31; i ++) {
          date = new Date(2015, 1, i + 1);
          that.addBooking(car._id, date);
        }
      });
    };
  });

  res.send("success");

};

exports.addBooking = function(car_id, date) {
  var bookingData = new Booking(
    {
      "car_id": car_id,
      "date": date,
      "occupied": false
    }
  );

  var bookingModel = new Booking(bookingData);
  bookingModel.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
      //res.send("success");
    }
  });
};