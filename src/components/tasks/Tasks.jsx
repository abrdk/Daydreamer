import { useContext, useState, useEffect } from "react";
import styles from "@/styles/tasks.module.scss";
import Scrollbar from "react-scrollbars-custom";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import NewTaskBtn from "@/src/components/tasks/NewTaskBtn";
import TasksDraggableWrapper from "@/src/components/tasks/TasksDraggableWrapper";

import { TasksContext } from "@/src/context/TasksContext";

export default function Tasks({}) {
  const { tasksByProjectId } = useContext(TasksContext);

  const [containerHeight, setContainerHeight] = useState(0);

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
      <NewTaskBtn />
    </>
  );
}
