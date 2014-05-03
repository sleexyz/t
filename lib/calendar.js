var colors = require('colors'),
    sprintf = require('sprintf-js').sprintf,
    moment = require('moment');

moment.lang('en', {
	calendar: {
		lastDay: '[Yesterday]',
		sameDay: '[Today]',
		nextDay: '[Tomorrow]',
		lastWeek: '[Last] dddd',
		nextWeek: 'dddd',
		sameElse: 'MMMM Do'
	}
});

module.exports = function() {
	var events = [];
	this.init = function(tree){
		for (var i = 0; i < tree.children.length; i++) {
			var child = tree.children[i];
			if (child.data.substring(0,1) == "@") {
				try {
					var month = child.data.substring(1);
					for (var j = 0; j < child.children.length; j++) {
						var subchild = child.children[j];
						try {
							var date = subchild.data;
							for (var k = 0; k < subchild.children.length; k++) {
								var eventnode = subchild.children[k];
								var event = {
									'date': moment(month + date,"MMDD"),
									'text': eventnode.data
								};
								var topevent = events[events.length - 1] || {date: 0};
								if (event.date >= topevent.date) {
									events.push(event);
								} else {
									events.unshift(event);
								}
							}
						} catch(e) {continue}
					}
				} catch(e) {continue}
			}
		}

	}
	this.functions = {
		"print": function(argv) {
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				console.log(sprintf("%20s\t\t%15s\t\t%15s",event.date.calendar().grey, event.date.fromNow(), event.text.yellow));
			}

		},
	}
	this.defaultfunction = this.functions.print;
	this.about = "track temporal absolutes"
}
