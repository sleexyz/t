var colors = require('colors'),
    tabdown = require('tabdown'),
    sprintf = require('sprintf-js').sprintf,
    moment = require('moment'),
    relativedateparse = require('./relativedateparse');


module.exports = function() {

	var todos = [];
	var eventuallies = [];



	this.init = function(tree){
		var now = moment();

		for (var i = 0; i < tree.children.length; i++) {
			var category = tree.children[i];
			var header = category.data;
			if (header.substring(0,2) == "#!") {
				var iseventually = (header.substring(header.length - 3) == '...');

				tabdown.traverse(category, function(node) {
					if (node.depth !== 0) {
						if (node.children.length == 0) {
							function getLine(node) {
								var parts = [];
								function _getLine(node) {
									if (node.depth >= 1){
										_getLine(node.parent);
										parts.push(node.data);
									}
								}
								_getLine(node);
								return parts.join(' ');
							}
							var task = {
								"what": getLine(node),
								"when": header.substring(2)
							}
							var parsed = relativedateparse(task.when);
							if (parsed) {
								task.date = parsed;
							}
							task.color = (function(task) {
								if (task.when == "ASAP") return "yellow";
								if (task.date == undefined) return "blue";

								var daysdiff = task.date.diff(now, "days");
								if (daysdiff == 0) return "white";
								if (daysdiff == 1) return "green";
								if (daysdiff == 2) return "magenta";
								return "white";
							})(task);

							

							if (iseventually) eventuallies.push(task);
							else todos.push(task);
						}
					}
				});
			}
		}
		todos.sort(function(a,b) { // most urgent towards beginning of array
			if (a.when == "ASAP") return 0;
			if (a.date == undefined) return 1;
			if (b.date == undefined) return 0;
			else return a.date - b.date;
		});
	}
	this.functions = {
		"print": function(argv) {
			var argv = argv || ["todos"];
			if (argv.length == 0) argv = ["todos"]; //default value

			if (argv[0] == "todos") {
				for (var i = 0; i < todos.length; i++) {
					var task = todos[i];
					var lpadding = "";
					var rpadding = "";
					if (task.when == "ASAP") {
						lpadding = "\n";
						rpadding = "\n";
					} else if (task.when == "Today") {
						rpadding = "\n";
					}
					console.log(lpadding + sprintf("%30s\t\t%s", task.when.grey, task.what[task.color]) + rpadding);
				}
			}

			if (argv[0] == "eventuallies") {
				for (var i = 0; i < eventuallies.length; i++) {
					var task = eventuallies[i];
					console.log(sprintf("%30s\t\t%s", task.when.grey, task.what));
				}
			}
		},
		"list": function(argv) {
			var argv = argv || [];
			var howmany = todos.length;
			if (argv.length >  0){
				try{
					howmany = parseInt(argv[0]);
				} catch(e) {
					console.error(e);
				}
			}

			for (var i = 0; i < howmany; i++) {
				var task = todos[i];
				console.log(task.what);
			}
		},
		"help": function() {
			console.log("Usage: t todo [print/list]\n\n\tTODO: document");
		}
	}
	this.about = "manage imperatives"
	this.defaultfunction = this.functions.print;
}
