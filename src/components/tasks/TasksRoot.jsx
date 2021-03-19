import { useContext } from "react";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function TasksRoot({
  root,
  setContainerHeight,
  editedTask,
  setEditedTask,
}) {
  const { tasksByProjectId } = useContext(TasksContext);

  const sortedTasks = tasksByProjectId
    .filter((task) => task.root == root)
    .sort((task1, task2) => task1.order > task2.order);

  const tasksComponents = sortedTasks.map((task) => (
    <Task
      key={task._id}
      task={task}
      setContainerHeight={setContainerHeight}
      editedTask={editedTask}
      setEditedTask={setEditedTask}
    />
  ));

  return tasksComponents;
}
