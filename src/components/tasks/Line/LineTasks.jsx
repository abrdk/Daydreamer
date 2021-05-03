import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState, useContext, memo } from "react";
import useMedia from "use-media";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";
import ScrollBinder from "@/src/components/tasks/Line/ScrollBinder";

import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

function InnerLineTasks({
  calendarStartDate,
  calendarEndDate,
  editedTaskId,
  view,
}) {
  const isMobile = useMedia({ maxWidth: 576 });

  const [calendarWidth, setCalendarWidth] = useState(0);

  useEffect(() => {
    let currentCalendarWidth = 0;
    document.querySelectorAll(".month").forEach((el) => {
      currentCalendarWidth += el.offsetWidth;
    });
    setCalendarWidth(currentCalendarWidth);
  }, [view, calendarStartDate, calendarEndDate]);

  return (
    <div
      className={styles.scrollContainer}
      style={{ top: isMobile ? 74 : view == "Day" ? 73 : 68 }}
    >
      <Scrollbar
        style={{
          height: isMobile
            ? "calc(100vh - 157px)"
            : editedTaskId
            ? "calc(100vh - 563px)"
            : "calc(100vh - 177px)",
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
                  height: isMobile
                    ? "calc(100% - 180px)"
                    : editedTaskId
                    ? "calc(100% - 219px - 380px)"
                    : "calc(100% - 219px)",
                  top: isMobile ? 163 : null,
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
          <LineTasksRoot calendarStartDate={calendarStartDate} root={""} />
        </div>
      </Scrollbar>
    </div>
  );
}

InnerLineTasks = memo(InnerLineTasks);

export default function LineTasks(props) {
  const { editedTaskId } = useContext(TasksContext);
  const { view } = useContext(OptionsContext);

  return <InnerLineTasks {...{ ...props, editedTaskId, view }} />;
}
