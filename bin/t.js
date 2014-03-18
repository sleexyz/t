#!/usr/bin/env node

var fs = require('fs'),
    colors = require('colors'),
    T = require('../');

var path = '/home/slee2/s'

var plugins = {
	"todo": new (require('../lib/todo')),
	"cal": new (require('../lib/calendar')),
	"list": new (require('../lib/list')),
}

var otherfuncs = (function() {
	function help() {
		var message = "Usage: t [module] [function]\n\nModules:";
		console.log(message);
		for (key in plugins) {
			console.log(' ' + key + '\t' + plugins[key].about);
		}
		console.log("\nOther functions:\n help\tshow this info\n about\tshow about info");
		console.log("\ntype `t [module] help` for module info and usage");
	}
	function about() {
		var message = "\n\t" + " t".yellow + "\n\n" + " t".yellow + "ab structured\n" + " t".yellow + "rees to plan for\n"+ " t".yellow + "oday and\n" + " t".yellow + "omorrow.\n\n\n" + "t".yellow + " is a program built off of tabdown to organize\nmental clutter in regards to today and tomorrow.\nIt includes a calendar system, a todo list system,\nand a basic list system.\n\n\nCreated by Sean Lee\n";
		console.log(message);
	}

	return {
		"help": help,
		"--help": help,
    		"about": about,
	}
})();
//var noargsfunction = otherfuncs.help;
var noargsfunction = plugins.todo.functions.print;

function parseargs(argv) {
	if (argv.length == 0) {
		noargsfunction();
	} else if (argv.length == 1){
		var arg = argv[0];
		if (plugins[arg] !== undefined) {
			plugins[arg].defaultfunction();
		} else if (otherfuncs[arg] !== undefined) {
			otherfuncs[arg]();
		}else {
			console.error('Error parsing options...');
			otherfuncs.help();
		}
	} else {
		if (plugins[argv[0]] !== undefined) {
			var func = plugins[argv[0]].functions[argv[1]];
			if (func !== undefined) {
				func(argv.splice(2));
			} else {
				console.error('Error parsing options for ' + argv[0] + '...');
				plugins[argv[0]].help();
			}
		} else {
			console.error('Error parsing options...');
			otherfuncs.help();
		}
	}
}

fs.readFile(path, function(err, data) {
	var lines = data.toString().split('\n');
	var t = new T(lines, plugins);

	var argv = process.argv.splice(2);
	parseargs(argv);
});
