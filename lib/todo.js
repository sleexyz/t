var colors = require('colors');

module.exports = function() {
	var todos = [];
	//what about init function?
	this.init = function(tree){
		for (var i = 0; i < tree.children.length; i++) {
			var child = tree.children[i];
			if (child.data.line.substring(0,2) == "#!") {
				for (var j = 0; j < child.children.length; j++) {
					var todonode = child.children[j];
					todos.push(todonode.data.line);
				}
			}
		}

	}
	this.functions = {
		"print": function() {
			console.log(todos);

		}
	}
}
