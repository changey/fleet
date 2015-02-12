var mongoose = require("mongoose");
var Return = require("./models/return_model.js");
var Booking = require("./models/booking_model.js");
var Global = require("./global.js");
var _ = require('underscore');
var UpdateCar = require("./updateCar.js");
require("./config.js");

exports.insertReturn = function(req, res) {

  var returnData = new Return(
    {
      "car_id": req.body.carId,
      "member_id": "123",
      "start_date": Global.parseQueryDate(req.body.reservedDate),
      "executed": false
    }
  );

  var returnModel = new Return(returnData);
  returnModel.save(function(err) {
    if(err) {
      console.log('Error on save!')
    }
  });

  UpdateCar.updateCar(req, res);

};

exports.executeReturn = function(req, res) {

  var that = this;

  var car_id = req.body.carId;

  UpdateCar.updateCar(req, res);
  
  Return.find({
    car_id: car_id,
    executed: false
  }).exec(function(err, returns) {

    if(err || !returns || returns.length === 0) {
      res.send("No Return Found");
    } else {
      var reservedDates = Global.getDates(returns[0].start_date, new Date(2015, 1, 11));

      for (var i = 0; i < _.size(reservedDates); i++) {
        that.occupyCar(car_id, reservedDates[i]);
      }
    };
  });

  Return.update({
      car_id: car_id,
      executed: false
    }, {
      car_id: car_id,
      executed: true
    }, {
      upsert: true
    },
    function(err, doc) {
    });
};

exports.occupyCar = function(car_id, date) {

  Booking.update({
      car_id: car_id,
      date: date
    }, {
      car_id: car_id,
      occupied: false
    }, {
      upsert: true
    },
    function(err, doc) {
    });
};