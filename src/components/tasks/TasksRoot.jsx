import { useContext } from "react";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksRoot({ root, setContainerHeight }) {
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }
  const { tasks } = useContext(TasksContext);
  const sortedTasks = tasks
    .filter((task) => task.root == root && task.project == currentProject._id)
    .sort((task1, task2) => task1.order > task2.order);

  const tasksComponents = sortedTasks.map((task) => (
    <Task key={task._id} task={task} setContainerHeight={setContainerHeight} />
  ));

  return tasksComponents;
}
