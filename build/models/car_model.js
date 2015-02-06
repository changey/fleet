var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carSchema = new mongoose.Schema({
  "car_id": String,
  "thumbnail": String,
  "make": String,
  "model": String,
  "state": String
  // o - occupied
  // op - occupied, pending return
  // u - unoccupied
  // up - unoccupied, pending return
});

module.exports = mongoose.model('cars', carSchema);