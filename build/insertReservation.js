var mongoose = require("mongoose");
var Reservation = require("./models/reservation_model.js");
var Booking = require("./models/booking_model.js");
var Global = require("./global.js");
var _ = require('underscore');
var UpdateCar = require("./updateCar.js");
require("./config.js");

exports.insertReservation = function(req, res) {

  var reservationData = new Reservation(
    {
      "car_id": req.body.carId,
      "member_id": "123",
      "start_date": Global.parseQueryDate(req.body.reservedDate),
      "executed": false
    }
  );

  var reservationModel = new Reservation(reservationData);
  reservationModel.save(function(err) {
    if(err) {
      console.log('Error on save!')
    }
  });
  
  UpdateCar.updateCar(req, res);

};

exports.executeReservation = function(req, res) {

  var that = this;
  
  var car_id = req.body.carId;

  Reservation.find({
    car_id: car_id,
    executed: false
  }).exec(function(err, reservations) {

    if(err || !reservations || reservations.length === 0) {
      res.send("No Reservation Found");
    } else {
      var reservedDates = Global.getDates(Global.getTodayDate(), new Date(2015, 1, 11));

      for (var i = 0; i < _.size(reservedDates); i++) {
        that.occupyCar(car_id, reservedDates[i]);
      }
    };
  });
  
  Reservation.update({
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

  UpdateCar.updateCar(req, res);
};

exports.occupyCar = function(car_id, date) {

  Booking.update({
      car_id: car_id,
      date: date
    }, {
      car_id: car_id,
      occupied: true
    }, {
      upsert: true
    },
    function(err, doc) {
    });
};