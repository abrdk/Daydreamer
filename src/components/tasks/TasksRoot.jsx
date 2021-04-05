import { useContext } from "react";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/TasksContext";

export default function TasksRoot({ root, setContainerHeight }) {
  const { tasksByProjectId, isTaskOpened } = useContext(TasksContext);

  const sortedTasks = tasksByProjectId
    .filter((task) => task.root == root)
    .sort((task1, task2) => task1.order > task2.order);

  const findSubtasksIds = (_id) =>
    tasksByProjectId
      .filter((t) => t.root == _id)
      .sort((task1, task2) => task1.order > task2.order)
      .map((t) => [t._id, ...findSubtasksIds(t._id)]);
  const findTaskWithSubtaskIds = (_id) => [_id, ...findSubtasksIds(_id)];

  const sortedTasksIds = tasksByProjectId
    .filter((t) => t.root == "")
    .sort((task1, task2) => task1.order > task2.order)
    .map((t) => findTaskWithSubtaskIds(t._id).flat())
    .flat();

  const getTaskIndex = (_id) => {
    let index = 0;
    for (let currentId of sortedTasksIds) {
      if (currentId == _id) {
        return index;
      }
      const currentTask = tasksByProjectId.find((t) => t._id == currentId);
      if (currentTask && !currentTask.root) {
        index += 1;
      } else if (currentTask) {
        const rootOfCurrentTask = tasksByProjectId.find(
          (t) => t._id == currentTask.root
        );
        if (isTaskOpened[rootOfCurrentTask._id]) {
          index += 1;
        }
      }
    }
    return index;
  };

  const tasksComponents = sortedTasks.map((task) => (
    <Task
      key={task._id}
      index={getTaskIndex(task._id)}
      task={task}
      setContainerHeight={setContainerHeight}
    />
  ));

  return tasksComponents;
}
