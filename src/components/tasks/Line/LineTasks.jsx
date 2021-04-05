import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState, useContext } from "react";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";
import ScrollBinder from "@/src/components/tasks/Line/ScrollBinder";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function LineTasks({ setMenu, calendarStartDate, view }) {
  const { editedTaskId } = useContext(TasksContext);

  const [calendarWidth, setCalendarWidth] = useState(0);

  useEffect(() => {
    let currentCalendarWidth = 0;
    document.querySelectorAll(".month").forEach((el) => {
      currentCalendarWidth += el.offsetWidth;
    });
    setCalendarWidth(currentCalendarWidth);
  }, [view]);

  return (
    <div
      className={styles.scrollContainer}
      style={{ top: view == "Day" ? 73 : 68 }}
    >
      <Scrollbar
        style={{
          height: editedTaskId ? "calc(100vh - 563px)" : "calc(100vh - 177px)",
          width: calendarWidth,
        }}
        noScrollX={true}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{
                  height: editedTaskId
                    ? "calc(100% - 182px - 37px - 380px)"
                    : "calc(100% - 182px - 37px)",
                }}
                className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-TaskLines"
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
                className="ScrollbarsCustom-Scroller LineTasks-Scroller"
              />
            );
          },
        }}
      >
        <div id="linesWrapper">
          <ScrollBinder />
          <LineTasksRoot
            calendarStartDate={calendarStartDate}
            setMenu={setMenu}
            root={""}
            view={view}
          />
        </div>
      </Scrollbar>
    </div>
  );
}
