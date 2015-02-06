var fleetJson = require('../data.json');

exports.requestFleet = function(req, res) {
  res.send(fleetJson);
}