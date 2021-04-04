import { useContext, useState, useEffect } from "react";
import styles from "@/styles/tasks.module.scss";
import { nanoid } from "nanoid";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import TasksDraggableWrapper from "@/src/components/tasks/TasksDraggableWrapper";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { ProjectsContext } from "@/src//context/projects/ProjectsContext";
import { UsersContext } from "@/src/context/users/UsersContext";

const blueColor = "258EFA";
const defaultTaskDuration = 7;

export default function Tasks({}) {
  const userCtx = useContext(UsersContext);

  const {
    createTask,
    tasksByProjectId,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
  } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);

  const [containerHeight, setContainerHeight] = useState(0);

  const isUserOwnProject = () => projectByQueryId.owner == userCtx._id;

  const createNewTask = () => {
    const newTaskId = nanoid();

    if (editedTaskId) {
      setTimeout(() => setEditedTaskId(newTaskId), 100);
      setWhereEditNewTask("edit");
    } else {
      setWhereEditNewTask("menu");
    }

    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    let afterWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + defaultTaskDuration - 1,
      23,
      59,
      59
    );

    const topLevelTasks = tasksByProjectId.filter((task) => !task.root);

    createTask({
      _id: newTaskId,
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: blueColor,
      project: projectByQueryId._id,
      root: "",
      order: topLevelTasks.length,
    });
  };

  useEffect(() => {
    if (!tasksByProjectId.length) {
      setContainerHeight(0);
    }
  }, [tasksByProjectId]);

  return (
    <>
      <div className={styles.line}></div>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>TASK NAME</div>
      </div>
      <div className={styles.line}></div>
      <Scrollbar
        style={{ height: containerHeight }}
        noScrollX={true}
        className={styles.root}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <span
                {...restProps}
                ref={elementRef}
                className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-Tasks"
              />
            );
          },
        }}
        scrollerProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                className="ScrollbarsCustom-Scroller Tasks-Scroller"
              />
            );
          },
        }}
      >
        <TasksRoot root={""} setContainerHeight={setContainerHeight} />
      </Scrollbar>
      <When condition={isUserOwnProject()}>
        <div className={styles.newTaskBtn} onClick={createNewTask}>
          + New Task
        </div>
      </When>
    </>
  );
}
