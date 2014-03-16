var fs = require('fs'),
    tabdown = require('./tabdown');

var path = '/home/slee2/s'

fs.readFile(path, function(err, data) {
	var lines = data.toString().split('\n');
	var tree = tabdown.parse(lines);
	tabdown.print(tree);
});
