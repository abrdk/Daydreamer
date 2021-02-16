import { useContext, useState, useEffect } from "react";
import styles from "@/styles/tasks.module.scss";
import { nanoid } from "nanoid";
import Scrollbar from "react-scrollbars-custom";

import TasksRoot from "@/src/components/tasks/TasksRoot";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { ProjectsContext } from "@/src//context/projects/ProjectsContext";

export default function Tasks() {
  const [containerHeight, setContainerHeight] = useState(0);
  const { tasks, createTask, updateTask } = useContext(TasksContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }
  useEffect(() => {
    setContainerHeight(0);
  }, [currentProject]);

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

  // drag code
  // const reorderHandler = ({ oldIndex, newIndex, tasksList }) => {
  //   if (oldIndex != newIndex) {
  //     const draggableTask = tasksList[oldIndex];
  //     updateTask({ ...draggableTask, order: newIndex });
  //     if (newIndex > oldIndex) {
  //       tasksList.slice(oldIndex + 1, newIndex + 1).forEach((project) => {
  //         updateTask({ ...project, order: project.order - 1 });
  //       });
  //     } else {
  //       tasksList.slice(newIndex, oldIndex).forEach((project) => {
  //         updateTask({ ...project, order: project.order + 1 });
  //       });
  //     }
  //   }
  // };

  // const dragEndHandler = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) {
  //     return;
  //   }
  //   if (source.droppableId === destination.droppableId) {
  //     reorderHandler({
  //       tasksList: tasks
  //         .filter(
  //           (task) =>
  //             task.root ==
  //               source.droppableId.slice(10, source.droppableId.length) &&
  //             task.project == currentProject._id
  //         )
  //         .sort((task1, task2) => task1.order > task2.order),
  //       oldIndex: source.index,
  //       newIndex: destination.index,
  //     });
  //   } else {
  //   }
  // };

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
