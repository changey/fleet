var mongoose = require("mongoose");
var Member = require("./models/member_model.js");
require("./config.js");

exports.insertMember = function(req, res) {

  var memberData = new Member(
    {
      "username": "eric"
    }
  );

  var memberModel = new Member(memberData);
  memberModel.save(function(err) {
    if(err) {
      console.log('Error on save!')
    } else {
      res.send("success");
    }
  });

};