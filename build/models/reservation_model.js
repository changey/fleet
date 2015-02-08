var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservationSchema = new mongoose.Schema({
  "car_id": String,
  "user_id": String,
  "start_date": Date,
  "execute": Boolean
});

module.exports = mongoose.model('reservations', reservationSchema);