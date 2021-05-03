import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect, memo } from "react";
import useEvent from "@react-hook/event";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

function InnerLeftStick({
  task,
  isResizeLeft,
  setIsResizeLeft,
  lineRef,
  dayWidth,
  dateStart,
  setDateStart,
  dateEnd,
  taskWidth,
  globalCursor,
  updateTask,
  isUserOwnsProject,
  view,
}) {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  useEvent(document, "keydown", (e) => {
    if (e.key == " ") {
      setIsSpacePressed(true);
    }
  });
  useEvent(document, "keyup", (e) => {
    if (e.key == " ") {
      setIsSpacePressed(false);
    }
  });

  const [scrollLeft, setScrollLeft] = useState(undefined);

  const startResizeLeft = () => {
    if (!isSpacePressed) {
      setIsResizeLeft(true);
      document.body.style.cursor = "ew-resize";
    }
  };

  const stopResizeLeft = () => {
    updateTask({ ...task, dateStart: dateStart });
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    setIsResizeLeft(false);
    document.body.style.cursor = "default";
  };

  const removeSelection = (e) => {
    e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
  };

  const setInitialScroll = () => {
    const calendarEl = document.querySelector(".Calendar-Scroller");
    if (calendarEl && typeof scrollLeft == "undefined") {
      setScrollLeft(calendarEl.scrollLeft);
    }
  };

  const resizeLeftHandler = (clientX) => {
    const calendarEl = document.querySelector(".Calendar-Scroller");
    if (!clientX) {
      if (calendarEl.scrollLeft > scrollLeft) {
        clientX = window.innerWidth;
      } else if (calendarEl.scrollLeft == scrollLeft) {
        return;
      } else {
        clientX = 0;
      }
    }
    setScrollLeft(calendarEl.scrollLeft);

    const lineRect = lineRef.current.getBoundingClientRect();
    const lineStyles = lineRef.current.style;

    const offset = clientX - lineRect.left;

    if (Number(lineStyles.width.slice(0, -2)) - offset <= dayWidth) {
      setDateStart(dateEnd);
    } else if (offset >= dayWidth || offset <= -dayWidth) {
      let dateDiff;
      if (offset >= dayWidth) {
        dateDiff = Math.floor(offset / dayWidth);
      } else {
        dateDiff = Math.ceil(offset / dayWidth);
      }
      const newDateStart = new Date(
        dateStart.getFullYear(),
        dateStart.getMonth(),
        dateStart.getDate() + dateDiff
      );
      if (newDateStart < dateEnd) {
        setDateStart(newDateStart);
      }
    }
  };

  useEvent(document, "mousemove", (e) => {
    if (isResizeLeft) {
      removeSelection(e);
      resizeLeftHandler(e.clientX);
    }
  });

  useEvent(document, "mouseup", (e) => {
    if (isResizeLeft) {
      stopResizeLeft();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", (e) => {
    if (isResizeLeft) {
      resizeLeftHandler();
    }
  });

  useEffect(() => {
    setInitialScroll();
  }, [document.querySelector(".Calendar-Scroller"), scrollLeft]);

  return (
    <When condition={view != "Month" || taskWidth > dayWidth * 4}>
      <When condition={isUserOwnsProject}>
        <div
          className={calendarStyles.resizeAreaLeft + " stick"}
          onMouseDown={startResizeLeft}
          style={{
            cursor: globalCursor ? globalCursor : "ew-resize",
          }}
        ></div>
      </When>
      <div
        className={calendarStyles.stick}
        style={{ width: taskWidth < 18 ? 0 : 2 }}
      ></div>
    </When>
  );
}

InnerLeftStick = memo(InnerLeftStick, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.globalCursor == nextProps.globalCursor &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.view == nextProps.view &&
    prevProps.isResizeLeft == nextProps.isResizeLeft &&
    prevProps.dayWidth == nextProps.dayWidth &&
    prevProps.dateStart == nextProps.dateStart &&
    prevProps.dateEnd == nextProps.dateEnd &&
    prevProps.taskWidth == nextProps.taskWidth
  );
});

export default function LeftStick(props) {
  const { updateTask } = useContext(TasksContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const { view } = useContext(OptionsContext);
  return (
    <InnerLeftStick {...{ ...props, updateTask, isUserOwnsProject, view }} />
  );
}
