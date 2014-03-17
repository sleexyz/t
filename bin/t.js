#!/usr/bin/env node

var fs = require('fs'),
    T = require('../');

var path = '/home/slee2/s'

var plugins = {
	"todo": new (require('../lib/todo')),
	"cal": new (require('../lib/calendar')),
	"list": new (require('../lib/list')),
}

fs.readFile(path, function(err, data) {
	var lines = data.toString().split('\n');
	var t = new T(lines, plugins);
	argv[]

	//plugins.todo.functions.print();
	plugins.cal.functions.print();
	//plugins.list.functions.print();
	//do some sort of parseargs thing, and have subcommands like git does
});
