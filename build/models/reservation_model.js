var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservationSchema = new mongoose.Schema({
  "car_id": String,
  "member_id": String,
  "start_date": Date,
  "executed": Boolean
});

module.exports = mongoose.model('reservations', reservationSchema);