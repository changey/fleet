Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

exports.getDates = function(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push( new Date (currentDate) )
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
};

exports.getTodayDate = function() {
  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth();
  var year = today.getYear();
  
  return new Date(year + 1900, month, date);
};

exports.parseQueryDate = function(rawDate) {
  var dateElements = rawDate.split("/");
  var month = dateElements[0];
  var date = dateElements[1];
  var year = dateElements[2];
  
  return new Date(year, month - 1, date);
};

exports.calendarStopDate = new Date (2015, 1, 28);