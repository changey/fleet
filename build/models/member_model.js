var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var memberSchema = new mongoose.Schema({
  "username": String
});

module.exports = mongoose.model('members', memberSchema);