var tabdown = require('tabdown');

module.exports = function(lines, plugins) {
	var plugins = plugins || [];

	var tree = tabdown.parse(lines, function(data) {
		return data;
	});
	for (var key in plugins) {
		var plugin = plugins[key];
		plugin.init(tree);
	}
}
