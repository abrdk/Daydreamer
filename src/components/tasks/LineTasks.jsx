import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";
import Scrollbar from "react-scrollbars-custom";

import LineTasksRoot from "@/src/components/tasks/LineTasksRoot";

export default function LineTasks({
  setMenu,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
}) {
  let calendarWidth = 0;
  document.querySelectorAll(".month").forEach((el) => {
    calendarWidth += el.offsetWidth;
  });

  return (
    <div className={styles.scrollContainer}>
      <Scrollbar
        style={{
          height: editedTask ? "calc(100vh - 563px)" : "calc(100vh - 177px)",
          width: calendarWidth,
        }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  height: editedTask
                    ? "calc(100% - 182px - 37px - 380px)"
                    : "calc(100% - 182px - 37px)",
                }}
                className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-TaskLines"
              />
            );
          },
        }}
      >
        <div>
          <LineTasksRoot
            setMenu={setMenu}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            isSubtasksOpened={isSubtasksOpened}
            setIsSubtasksOpened={setIsSubtasksOpened}
            root={""}
          />
        </div>
      </Scrollbar>
    </div>
  );
}
