var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookingSchema = new mongoose.Schema({
  "car_id": String,
  "date": Date,
  "occupied": Boolean
});

module.exports = mongoose.model('bookings', bookingSchema);