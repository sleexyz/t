import todo
import os
import json

def main():
    lines = open("/home/slee2/s").readlines();
    tree = todo.todo_parse(lines)
#    print(json.dumps(tree, indent=4))
    tasks = todo.list_tasks(tree)
    print(json.dumps(tasks, indent=4))

if __name__ == "__main__":
    main()
