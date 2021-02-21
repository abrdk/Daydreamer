import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";
import Scrollbar from "react-scrollbars-custom";

import LineTasksRoot from "@/src/components/tasks/LineTasksRoot";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTasks({ setMenu, editedTask, setEditedTask }) {
  const { tasksByProjectId } = useContext(TasksContext);

  const getCalendarWidth = useMemo(() => {
    let calendarWidth = 0;
    document.querySelectorAll(".month").forEach((el) => {
      calendarWidth += el.offsetWidth;
    });
    return calendarWidth;
  }, [tasksByProjectId]);

  return (
    <div className={styles.scrollContainer}>
      <Scrollbar
        style={{
          height: "calc(100vh - 177px)",
          width: getCalendarWidth,
        }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-TaskLines"
              />
            );
          },
        }}
      >
        <LineTasksRoot
          setMenu={setMenu}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          root={""}
        />
      </Scrollbar>
    </div>
  );
}
