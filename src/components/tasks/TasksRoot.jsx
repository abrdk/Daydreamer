import { useContext } from "react";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksRoot({
  root,
  setContainerHeight,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
}) {
  const userCtx = useContext(UsersContext);
  const { projectByQueryId } = useContext(ProjectsContext);

  const { tasks, tasksByProjectId } = useContext(TasksContext);
  let sortedTasks;
  if (projectByQueryId.owner == userCtx._id) {
    sortedTasks = tasks
      .filter(
        (task) => task.root == root && task.project == projectByQueryId._id
      )
      .sort((task1, task2) => task1.order > task2.order);
  } else {
    sortedTasks = tasksByProjectId
      .filter((task) => task.root == root)
      .sort((task1, task2) => task1.order > task2.order);
  }

  const tasksComponents = sortedTasks.map((task) => (
    <Task
      key={task._id}
      task={task}
      setContainerHeight={setContainerHeight}
      editedTask={editedTask}
      setEditedTask={setEditedTask}
      isSubtasksOpened={isSubtasksOpened}
      setIsSubtasksOpened={setIsSubtasksOpened}
    />
  ));

  return tasksComponents;
}
