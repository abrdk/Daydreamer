import { useContext } from "react";
import styles from "../../../styles/tasks.module.css";

import TasksRoot from "./TasksRoot";

import { TasksContext } from "../../context/tasks/TasksContext";
import { ProjectsContext } from "../../context/projects/ProjectsContext";

export default function Tasks() {
  const { tasks, createTask } = useContext(TasksContext);
  const { projects } = useContext(ProjectsContext);

  const createHandle = () => {
    const currentDate = new Date();
    let afterWeek = currentDate;
    afterWeek.setDate(afterWeek.getDate() + 7);

    const currentProject = projects.find((project) => project.isCurrent);
    const topLevelTasks = tasks.filter((task) => !task.root);

    createTask({
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "FFBC42",
      project: currentProject._id,
      root: "",
      order: topLevelTasks.length,
    });
  };

  return (
    <>
      <div className={styles.line}></div>
      <div className={styles.tasksHeaderWrapper}>
        <div className={styles.tasksHeader}>TASK NAME</div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.tasksRoot}>
        <TasksRoot root={""} />
      </div>
      <div className={styles.newTaskBtn} onClick={createHandle}>
        + New Task
      </div>
    </>
  );
}
