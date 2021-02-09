import { useContext, useState, useEffect } from "react";
import { When } from "react-if";
import styles from "@/styles/tasks.module.scss";

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
  const filteredTasks = tasks.filter(
    (task) => task.root == root && task.project == currentProject._id
  );

  const [isSubtasksOpened, setSubtasksState] = useState(
    filteredTasks.map(() => false)
  );

  useEffect(() => {
    setContainerHeight(document.querySelectorAll(".task").length * 55);
  }, [filteredTasks, isSubtasksOpened]);

  const tasksComponents = filteredTasks
    .sort((task1, task2) => task1.order > task2.order)
    .map((task, i) => {
      const subTasks = tasks.filter((subTask) => subTask.root == task._id);
      return (
        <div key={task._id}>
          <Task
            task={task}
            hasSubtasks={subTasks.length ? true : false}
            isSubtasksOpened={isSubtasksOpened}
            setSubtasksState={setSubtasksState}
          />
          <When condition={subTasks.length && isSubtasksOpened[i]}>
            <div className={styles.subtasksWrapper}>
              <TasksRoot
                root={task._id}
                setContainerHeight={setContainerHeight}
              />
            </div>
          </When>
        </div>
      );
    });

  return <>{tasksComponents}</>;
}
