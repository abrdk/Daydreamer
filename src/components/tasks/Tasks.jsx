import { useContext, useState } from "react";
import styles from "@/styles/tasks.module.scss";
import { nanoid } from "nanoid";
import Scrollbar from "react-scrollbars-custom";

import TasksRoot from "@/src/components/tasks/TasksRoot";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { ProjectsContext } from "@/src//context/projects/ProjectsContext";

export default function Tasks() {
  const [containerHeight, setContainerHeight] = useState(0);
  const { tasks, createTask } = useContext(TasksContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }

  const createHandle = async () => {
    const currentDate = new Date();
    let afterWeek = currentDate;
    afterWeek.setDate(afterWeek.getDate() + 7);

    const topLevelTasks = tasks.filter(
      (task) => !task.root && task.project == currentProject._id
    );

    await createTask({
      _id: nanoid(),
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
      <Scrollbar
        style={{ height: containerHeight }}
        className={styles.tasksRoot}
        // noScrollY={true}
        // permanentTracks={false}
        // removeTracksWhenNotUsed={true}
      >
        <TasksRoot root={""} setContainerHeight={setContainerHeight} />
      </Scrollbar>
      <div className={styles.tasksRoot}></div>
      <div className={styles.newTaskBtn} onClick={createHandle}>
        + New Task
      </div>
    </>
  );
}
