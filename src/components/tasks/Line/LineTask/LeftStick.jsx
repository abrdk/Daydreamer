import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect, memo } from "react";
import useEvent from "@react-hook/event";
import useEventListener from "@use-it/event-listener";

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
    if (e.target.ownerDocument) {
      e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
    }
  };

  const resizeLeftHandler = (clientX) => {
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

  useEvent(document, "touchmove", (e) => {
    if (isResizeLeft) {
      removeSelection(e);
      resizeLeftHandler(e.touches[0].clientX);
    }
  });

  useEventListener(
    "touchmove",
    (e) => {
      if (isResizeLeft) {
        e.preventDefault();
      }
    },
    document,
    { passive: false }
  );

  useEvent(document, "touchend", (e) => {
    if (isResizeLeft) {
      stopResizeLeft();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", (e) => {
    if (
      isResizeLeft &&
      !(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    ) {
      resizeLeftHandler();
    }
  });

  return (
    <When condition={(taskWidth - 4) / 3 > 3}>
      <When condition={isUserOwnsProject}>
        <div
          className={calendarStyles.resizeAreaLeft + " stick"}
          onMouseDown={startResizeLeft}
          onTouchStart={startResizeLeft}
          style={{
            cursor: globalCursor ? globalCursor : "ew-resize",
            width: taskWidth >= 36 ? 18 : taskWidth / 2,
          }}
        ></div>
      </When>
      <div className={calendarStyles.stick}></div>
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
