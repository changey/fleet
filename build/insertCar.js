var mongoose = require("mongoose");
var Car = require("./models/car_model.js");
var cars = require("../cars.json");
var _ = require("underscore");
require("./config.js");

exports.insertCar = function(req, res) {

  _.each(cars, function(car, index) {

    if(car !== null) {

      Car.find().limit(1)
        .exec(function(err, result) {

          var carModel = new Car(car);
          carModel.save(function(err) {
            if(err) console.log('Error on save!')
          });
        });
    }
    else {
      console.log("Error getting the car")
    }
  });
  
};

exports.simpleInsertCar = function(req, res) {

  var carData = new Car(
    {
      "car_id": "1",
      "thumbnail": "",
      "make": "Tesla",
      "model": "Model S",
      "state": "O"
    }
  );

  var carData2 = new Car(
    {
      "car_id": "2",
      "thumbnail": "",
      "make": "Nissan",
      "model": "Leaf",
      "state": "O"
    }
  );

  var carData3 = new Car(
    {
      "car_id": "3",
      "thumbnail": "",
      "make": "Nissan",
      "model": "Sentra",
      "state": "U"
    }
  );

  var carData4 = new Car(
    {
      "car_id": "4",
      "thumbnail": "",
      "make": "Honda",
      "model": "Civic",
      "state": "OP"
    }
  );

  var carData5 = new Car(
    {
      "car_id": "5",
      "thumbnail": "",
      "make": "Honda",
      "model": "Accord",
      "state": "UP"
    }
  );

  var carData6 = new Car(
    {
      "car_id": "6",
      "thumbnail": "",
      "make": "Honda",
      "model": "Accord",
      "state": "O"
    }
  );

  var carData7 = new Car(
    {
      "car_id": "7",
      "thumbnail": "",
      "make": "Honda",
      "model": "Accord",
      "state": "O"
    }
  );

  var carModel = new Car(carData);
  carModel.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
      // res.send("success");
    }
  });

  var carModel2 = new Car(carData2);
  carModel2.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
      //res.send("success");
    }
  });

  var carModel3 = new Car(carData3);
  carModel3.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
    }
  });

  var carModel4 = new Car(carData4);
  carModel4.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
    }
  });

  var carModel5 = new Car(carData5);
  carModel5.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {

    }
  });

  var carModel6 = new Car(carData6);
  carModel6.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {

    }
  });

  var carModel7 = new Car(carData7);
  carModel7.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
      res.send("success");
    }
  });
  
};