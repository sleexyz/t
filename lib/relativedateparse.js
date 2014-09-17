var moment = require('moment');

var keywords = {
	"Sunday": dayofweek(0),
	"Monday": dayofweek(1),
	"Tuesday": dayofweek(2),
	"Wednesday": dayofweek(3),
	"Thursday": dayofweek(4),
	"Friday": dayofweek(5),
	"Saturday": dayofweek(6),
	"Today": function(now) {
		return now;
	},
	"Tonight": function(now) {
		return now.add('minutes', 1);
	},
	"Tomorrow": function(now) {
		return now.add('days', 1);
	},

	"Weekend": function(now) {
		if ((((now.day() + 6) % 7)) < 4){ // if mon through thur
			return moment().day(5);
		}else{
			return now;
		}
	},
}

/**
 * returns a keyword function for a day of week keyword
 */
function dayofweek(day) {
	return function(now){
		if (now.day() > day) {
			day += 7;
		}
		//change string to keyword
		return moment().day(day)
	}
}

module.exports = function(string) {
	var now = moment();
	if (string in keywords) {
		return keywords[string](now);
	}
}
