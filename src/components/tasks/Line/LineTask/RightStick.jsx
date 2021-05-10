import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect, memo } from "react";
import useEvent from "@react-hook/event";
import useEventListener from "@use-it/event-listener";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

function InnerRightStick({
  task,
  isResizeRight,
  setIsResizeRight,
  lineRef,
  dayWidth,
  dateStart,
  dateEnd,
  setDateEnd,
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

  const startResizeRight = () => {
    if (!isSpacePressed) {
      setIsResizeRight(true);
      document.body.style.cursor = "ew-resize";
    }
  };

  const stopResizeRight = () => {
    updateTask({ ...task, dateEnd: dateEnd });
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    setIsResizeRight(false);
    document.body.style.cursor = "default";
  };

  const removeSelection = (e) => {
    e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
  };

  const resizeRightHandler = (clientX) => {
    const lineRect = lineRef.current.getBoundingClientRect();
    const lineStyles = lineRef.current.style;

    const offset = clientX - lineRect.right;
    if (Number(lineStyles.width.slice(0, -2)) + offset <= dayWidth) {
      setDateEnd(dateStart);
    } else if (offset >= dayWidth || offset <= -dayWidth) {
      let dateDiff;
      if (offset >= dayWidth) {
        dateDiff = Math.floor(offset / dayWidth);
      } else {
        dateDiff = Math.ceil(offset / dayWidth);
      }
      setDateEnd(
        new Date(
          dateEnd.getFullYear(),
          dateEnd.getMonth(),
          dateEnd.getDate() + dateDiff,
          23,
          59,
          59
        )
      );
    }
  };

  useEvent(document, "mousemove", (e) => {
    if (isResizeRight) {
      removeSelection(e);
      resizeRightHandler(e.clientX);
    }
  });

  useEvent(document, "mouseup", () => {
    if (isResizeRight) {
      stopResizeRight();
    }
  });

  useEvent(document, "touchmove", (e) => {
    if (isResizeRight) {
      removeSelection(e);
      resizeRightHandler(e.touches[0].clientX);
    }
  });

  useEventListener(
    "touchmove",
    (e) => {
      if (isResizeRight) {
        e.preventDefault();
      }
    },
    document,
    { passive: false }
  );

  useEvent(document, "touchend", (e) => {
    if (isResizeRight) {
      stopResizeRight();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", () => {
    if (
      isResizeRight &&
      !(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    ) {
      resizeRightHandler();
    }
  });

  return (
    <>
      <div className={calendarStyles.stick}></div>
      <When condition={isUserOwnsProject}>
        <div
          className={calendarStyles.resizeAreaRight + " stick"}
          onMouseDown={startResizeRight}
          onTouchStart={startResizeRight}
          style={{
            cursor: globalCursor ? globalCursor : "ew-resize",
            width:
              taskWidth >= 36
                ? 18
                : (taskWidth - 4) / 3 >= 3
                ? taskWidth / 2
                : taskWidth,
          }}
        ></div>
      </When>
    </>
  );
}

InnerRightStick = memo(InnerRightStick, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.globalCursor == nextProps.globalCursor &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.isResizeRight == nextProps.isResizeRight &&
    prevProps.dayWidth == nextProps.dayWidth &&
    prevProps.dateStart == nextProps.dateStart &&
    prevProps.dateEnd == nextProps.dateEnd &&
    prevProps.taskWidth == nextProps.taskWidth
  );
});

export default function RightStick(props) {
  const { updateTask } = useContext(TasksContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);
  return <InnerRightStick {...{ ...props, updateTask, isUserOwnsProject }} />;
}
