var moment = require('moment');

var daysoftheweek = [
	"Sunday",   // 0
	"Monday",   // 1
	"Tuesday",  // 2
	"Wednesday",// 3
	"Thursday", // 4
	"Friday",   // 5
	"Saturday"  // 6
];
var keywords = {
	"Today": function(now) {
		return now;
	},
	"Tomorrow": function(now) {
		return now.add('days', 1);
	},
	"Day after tomorrow": function(now) {
		return now.add('days', 2);
	}
}

module.exports = function(string) {
	var now = moment();
	var day = daysoftheweek.indexOf(string)
	if (day !== -1) {
		if (now.day() > day) {
			day += 7;
		}
		return moment().day(day)
	}
	if (string in keywords) {
		return keywords[string](now);
	}
}
