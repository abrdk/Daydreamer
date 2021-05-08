import React, { useContext, useState, useEffect, memo } from "react";
import styles from "@/styles/tasks.module.scss";
import Scrollbar from "react-scrollbars-custom";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import NewTaskBtn from "@/src/components/tasks/NewTaskBtn";
import TasksDraggableWrapper from "@/src/components/tasks/TasksDraggableWrapper";

import { TasksContext } from "@/src/context/TasksContext";

function InnerTasks({ hasTasksByProjectId, editedTaskId }) {
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!hasTasksByProjectId) {
      setContainerHeight(0);
    }
  }, [hasTasksByProjectId]);

  return (
    <>
      <div className={styles.line}></div>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>TASK NAME</div>
      </div>
      <div className={styles.line}></div>
      <Scrollbar
        className={
          editedTaskId ? `${styles.root} ${styles.rootShrink}` : styles.root
        }
        style={{
          height: containerHeight,
        }}
        noScrollX={true}
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
        <TasksDraggableWrapper>
          <TasksRoot root={""} setContainerHeight={setContainerHeight} />
        </TasksDraggableWrapper>
      </Scrollbar>
      <NewTaskBtn />
    </>
  );
}

InnerTasks = memo(InnerTasks);

export default function Tasks() {
  const { tasksByProjectId, editedTaskId } = useContext(TasksContext);

  const hasTasksByProjectId = tasksByProjectId.length > 0;

  return <InnerTasks {...{ hasTasksByProjectId, editedTaskId }} />;
}
