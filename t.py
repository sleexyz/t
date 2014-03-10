#!/usr/bin/env python

import os
import json
import sys
import datetime
import tabdown
import re
from operator import attrgetter
from termcolor import colored

## Path to list file
PATH='/home/slee2/s'

## Plugins
plugins = [
    {
        "name": "task",
        "prefixes": [("#!", "tasktime")],

    },
    {
        "name": "event",
        "prefixes": [("@", "event")],
    },
    {
        "name": "default",
        "prefixes": [("#", "header")],
    }
]

mode = "noargs"

@tabdown.on_parse
def populate_tree(line):
    """Takes a list of lines, returns a tree with lines of the appropriate categorization.
    Goes through plugins and their corresponding line prefixes to determine categorization.
    """
    node = {}
    splitted = re.compile('(^\W+)').split(line)
    hasprefix = len(splitted) > 1
    if hasprefix:
        prefix = splitted[1]
        body = splitted[2]
        for plugin in plugins:
            for prefixtup in plugin['prefixes']:
                if prefix == prefixtup[0]:
                    node["type"] = prefixtup[1]
                    node["text"] = splitted
                    return node
    node["type"] = "text"
    node["text"] = line
    return node

def main():
    lines = open("/home/slee2/s").readlines();
    tree = populate_tree(lines)

            
    if mode == "--all":
        print("--all")
    elif mode == "--now":
        print("--now");
    elif mode == "noargs":
        print(json.dumps(tree, sort_keys=True, indent=4))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        mode = sys.argv[1]
    main()

#TEMPORARY
def parse_tree(tree):
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
