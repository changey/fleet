var mongoose = require("mongoose");
var Booking = require("./models/booking_model.js");
require("./config.js");

exports.requestBooking = function(req, res) {

  var outputJson = '';
  Booking.find({
    date: new Date(2015, 1, 8)
  }).sort().exec(function(err, bookings) {

    if(err || !bookings || bookings.length === 0) {
      res.send("No Booking Found");
    } else {
      outputJson = JSON.stringify(bookings, null, ' ');
      res.send(outputJson);
    };
  });
}