var mongoose = require("mongoose");
var Booking = require("./models/booking_model.js");
require("./config.js");

exports.requestBooking = function(req, res) {

  var outputJson = '';
  Booking.find({
    date: { $gte: new Date(2015, 1, 10), $lte: new Date(2015, 1, 11) } 
  }).sort().exec(function(err, bookings) {

    if(err || !bookings || bookings.length === 0) {
      res.send("No Booking Found");
    } else {
      outputJson = JSON.stringify(bookings, null, ' ');
      res.send(outputJson);
    };
  });
}