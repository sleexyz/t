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

        today = datetime.date.today()
        tomorrow = datetime.date.today() + datetime.timedelta(days=1)

        if string == "ASAP":
            line_color = "cyan"
            line_attrs.append("blink")
            task["score"] = float("inf")
        else:
            year = datetime.datetime.today().year;

            def populatedata():
                nonlocal string, line_color, line_highlight, line_attrs, tomorrow, today
                month =  None
                day = None
                try:
                    month = int(task["when"][0])
                    day = int(task["when"][1])
                except:
                    if string == "Later":
                        task["score"] = float("-inf");
                        line_color = "blue"
                        return
                    if string == "Today":
                        month = today.month
                        day = today.day
                    elif string == "Tomorrow":
                        month = tomorrow.month
                        day = tomorrow.day
                if month == None and day == None:
                    task["score"] = 0
                else:
                    date = datetime.date(year, month, day)
                    if date == today:
                        line_color = "red"
                        if string != "Today":
                            date += datetime.timedelta(days=1)
                            string = "Today"
                    elif date == tomorrow:
                        line_color = "yellow"
                        if string !="Tomorrow":
                            date += datetime.timedelta(days=1)
                            string = "Tomorrow"
                    else:
                        inbetween = date - today
                        string = "In {} days".format(inbetween.days)
                    task["score"] = 1.0/date.toordinal()
            populatedata();

                    

        string = string + '\t\t'
        what = task["what"].copy()
        what[-1] = colored(task["what"][-1],"green")
        string = string + '\t'.join(what)

        task['string'] = (colored(string, line_color, line_highlight, attrs=line_attrs))

    if mode == "--all":
        for task in sorted(tasks, key=lambda task: task["score"], reverse=True):
            print(task["string"])
    else:
        sorted_tasks = sorted(filter(lambda x: x["score"] >= 0,tasks), key=lambda task: task["score"], reverse=True)
        if mode == "noargs":
            for task in sorted_tasks:
                print(task["string"])
        elif mode == "--now":
            print(' '.join(sorted_tasks[0]["what"]))

if __name__ == "__main__":
    main()
