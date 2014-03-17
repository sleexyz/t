var tabdown = require('tabdown'),
    colors = require('colors');

module.exports = function() {
	var lists = {};
	this.init = function(tree) {
		for (var i = 0; i< tree.children.length; i++) {
			var child = tree.children[i];
			if (child.data.line.substring(0,2) == "##"){
				var listname = child.data.line.substring(2);
				lists[listname] = child;
			}
		}
	}
	this.functions = {
		"print": function() {
			for (var key in lists) {
				var list = lists[key];
				console.log(("\n\t"+key+"\n").red);
				tabdown.traverse(list, function(node) {
					if (node.data.depth !== 0){
						var string = "";
						if (node.data.depth == 1) {
							string +='\n';
						}
						for (var i = 0; i < node.data.depth -1; i++) {
							string += '\t';
						}
						string += node.data.line;
						console.log(string);
					}
				});
				console.log('');
			}
		}

	}
	this.defaultfunction = this.functions.print;
	this.about = "more lists!";
}
