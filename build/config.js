var mongoose = require("mongoose");

var uristring = 'mongodb://localhost:27017/Fleet';

var DB_USER = "eric";
var DB_PASSWORD = "breeze";
var mongolabUri = "@ds031541.mongolab.com:31541/fleet";

var MONGOLAB_URI = "mongodb://"
  + DB_USER
  + ":"
  + DB_PASSWORD
  + mongolabUri;

uristring = MONGOLAB_URI;

mongoose.connect(uristring, function(err, res) {
  if(err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }
  else {
    console.log('Succeeded connected to: ' + uristring);
  }
});

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];