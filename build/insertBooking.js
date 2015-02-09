var url = require('url');
var mongoose = require("mongoose");
var Booking = require("./models/booking_model.js");
var Car = require("./models/car_model.js");
var Global = require("./global.js");
var _ = require('underscore');
require("./config.js");

exports.insertBooking = function(req, res) {

  var that = this;

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  if(query.password === "breeze") {
    
  }
  
  Car.find({
    state: "O"
  }).exec(function(err, cars) {

    if(err || !cars || cars.length === 0) {
      res.send("No Car Found");
    } else {
      cars.forEach( function(car) {
        var reservedDates = Global.getDates(Global.getTodayDate(), new Date(2015, 1, 28));
        for (var i = 0; i < _.size(reservedDates); i++) {
          that.addBooking(car._id, reservedDates[i]);
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
      "occupied": true
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