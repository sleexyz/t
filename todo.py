import tabdown
import re


@tabdown.on_parse
def todo_parse(line):
	"""Temporal significance is given to lines starting with a hashtag
	Takes a list of lines, returns a tree
	"""
	node = {}
	splitted = re.compile('(^#+)').split(line)

	if len(splitted) > 1:
		node["type"] = "when"
		node["text"] = splitted[2]
	else:
		node["type"] = "what"
		node["text"] = splitted[0]

	return node

def get_tasks(tree):

	"""Takes tree, returns list of tasks
	task = {"what": [], "when": []}
	"""
	tasks = []
	def _list(node, what, when):
		if node["type"] == "what":
			what.append(node["text"])

		elif node["type"] == "when":
			when.append(node["text"])

		if not "children" in node.keys():
			if len(what) == 0:
				return
			tasks.append({"what": what, "when": when})
			return

		for child in node['children']:
			_when = when.copy()
			_what = what.copy()
			_list(child, _what, _when)

	for child in tree["children"]:
		_list(child, [], [])
	return tasks
