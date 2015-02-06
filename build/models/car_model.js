var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carSchema = new mongoose.Schema({
  "car_id": String,
  "thumbnail": String,
  "make": String,
  "model": String,
  "state": String
  // O - occupied
  // OP - occupied, pending return
  // U - unoccupied
  // UP - unoccupied, pending return
});

module.exports = mongoose.model('cars', carSchema);