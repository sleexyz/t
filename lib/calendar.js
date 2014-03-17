var colors = require('colors'),
    cliff = require('cliff'),
    moment = require('moment');

//TODO:
//implement natural language
//implement times too
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
			if (child.data.line.substring(0,1) == "@") {
				try {
					var month = child.data.line.substring(1);
					for (var j = 0; j < child.children.length; j++) {
						var subchild = child.children[j];
						try {
							var date = subchild.data.line;
							for (var k = 0; k < subchild.children.length; k++) {
								var eventnode = subchild.children[k];
								events.push({
									'date': moment(month + date,"MMDD"),
									'text': eventnode.data.line
								});
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
				console.log(event.date.calendar() + '\t' + event.text + '\t' + event.date.fromNow());
			}

		},
	}
	this.defaultfunction = this.functions.print;
	this.about = "track temporal absolutes"
}
