#!/usr/bin/env python

import todo
import os
import json
import sys
import datetime
import re
from operator import attrgetter
from termcolor import colored

def main():
    lines = open("/home/slee2/s").readlines();
    tree = todo.todo_parse(lines)
    tasks = todo.get_tasks(tree)

    mode = "noargs"
    if len(sys.argv) > 1:
        mode = sys.argv[1]
            
    for task in tasks:
        line_color = None
        line_highlight = None
        line_attrs = []

        string = ' '.join(task["when"]) #concat temporals

        if string == "ASAP":
            line_color = "cyan"
            line_attrs.append("blink")
            task["score"] = float("inf")
        elif string == "Today":
            line_color = "red"
            task["score"] = 1.0/datetime.datetime.today().toordinal()
        elif string == "Later":
            line_color = "blue"
            task["score"] = float("-inf")
        else:
            splitted = string.split(' ')
            try:
                month = int(splitted[0])
                day = int(splitted[1])

                task["score"] = 1.0/datetime.datetime(datetime.datetime.today().year, month, day).toordinal()
            except:
                task["score"] = 0
        string = string + '\t\t'
        what = task["what"].copy()
        what[-1] = colored(task["what"][-1],"green")
        string = string + '\t'.join(what)

        task['string'] = (colored(string, line_color, line_highlight, attrs=line_attrs))

    if mode == "--all":
        for task in sorted(tasks, key=lambda task: task["score"], reverse=True):
            print(task["string"])
    else:
        sorted_tasks = sorted(filter(lambda x: x["score"] >=0,tasks), key=lambda task: task["score"], reverse=True)
        if mode == "noargs":
            for task in sorted_tasks:
                print(task["string"])
        elif mode == "--now":
            print(' '.join(sorted_tasks[0]["what"]))

if __name__ == "__main__":
    main()
