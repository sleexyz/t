#!/usr/bin/env node

var fs = require('fs'),
    tabdown = require('tabdown');

var path = '/home/slee2/s'

fs.readFile(path, function(err, data) {
	var lines = data.toString().split('\n');
	var tree = tabdown.parse(lines, function(data){
		return data;
	});
	//tabdown.print(tree);
});
