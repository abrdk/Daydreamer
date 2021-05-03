import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect, memo } from "react";
import useEvent from "@react-hook/event";

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

  const [scrollLeft, setScrollLeft] = useState(undefined);

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

  const setInitialScroll = () => {
    const calendarEl = document.querySelector(".Calendar-Scroller");
    if (calendarEl && typeof scrollLeft == "undefined") {
      setScrollLeft(calendarEl.scrollLeft);
    }
  };

  const resizeRightHandler = (clientX) => {
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

  useEvent(document, "mouseup", (e) => {
    if (isResizeRight) {
      stopResizeRight();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", () => {
    if (isResizeRight) {
      resizeRightHandler();
    }
  });

  useEffect(() => {
    setInitialScroll();
  }, [document.querySelector(".Calendar-Scroller"), scrollLeft]);

  return (
    <>
      <div className={calendarStyles.stick}></div>
      <When condition={isUserOwnsProject}>
        <div
          className={calendarStyles.resizeAreaRight + " stick"}
          onMouseDown={startResizeRight}
          style={{
            cursor: globalCursor ? globalCursor : "ew-resize",
            width: taskWidth > 18 ? 18 : taskWidth == 0 ? 160 / 30 : taskWidth,
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
