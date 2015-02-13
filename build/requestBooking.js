var mongoose = require("mongoose");
var Booking = require("./models/booking_model.js");
var Global = require("./global.js");
require("./config.js");

exports.requestBooking = function(req, res) {

  var outputJson = '';
  var startDate = Global.parseQueryDate(req.body.startDate);
  var endDate = Global.parseQueryDate(req.body.endDate);

  Booking.find({
    date: { $gte: startDate, $lte: endDate } 
  }).sort().exec(function(err, bookings) {

    if(err || !bookings || bookings.length === 0) {
      res.send("No Booking Found");
    } else {
      outputJson = JSON.stringify(bookings, null, ' ');
      res.send(outputJson);
    };
  });
}