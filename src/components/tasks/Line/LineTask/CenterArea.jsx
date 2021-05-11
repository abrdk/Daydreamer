import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState } from "react";
import useEvent from "@react-hook/event";
import useEventListener from "@use-it/event-listener";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

export default function CenterArea({
  task,
  isMoving,
  setIsMoving,
  lineRef,
  dayWidth,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  taskWidth,
  inputRef,
  globalCursor,
  children,
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

  const { updateTask } = useContext(TasksContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const { setIsCalendarScrollLock } = useContext(OptionsContext);

  const [offsetFromCenter, setOffsetFromCenter] = useState(0);

  const startMoving = (e) => {
    if (e.target != inputRef.current && isUserOwnsProject && !isSpacePressed) {
      setIsMoving(true);
      const lineRect = lineRef.current.getBoundingClientRect();
      const cursorX = e.clientX || e.touches[0].clientX;
      setOffsetFromCenter(lineRect.left + lineRect.width / 2 - cursorX);
      document.body.style.cursor = "grab";
    }
  };

  const stopMoving = () => {
    updateTask({ ...task, dateStart, dateEnd });
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    setOffsetFromCenter(0);
    setIsMoving(false);
    document.body.style.cursor = "default";
  };

  const removeSelection = (e) => {
    if (e.target.ownerDocument) {
      e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
    }
  };

  const movingHandler = (clientX) => {
    const lineRect = lineRef.current.getBoundingClientRect();

    const offset =
      clientX - (lineRect.right - lineRect.width / 2) + offsetFromCenter;

    if (offset >= dayWidth || offset <= -dayWidth) {
      let dateDiff;
      if (offset >= dayWidth) {
        dateDiff = Math.floor(offset / dayWidth);
      } else {
        dateDiff = Math.ceil(offset / dayWidth);
      }
      setDateStart(
        new Date(
          dateStart.getFullYear(),
          dateStart.getMonth(),
          dateStart.getDate() + dateDiff
        )
      );
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

  const getCursor = () => {
    if (!isUserOwnsProject) {
      return "default";
    }
    if (globalCursor) {
      return globalCursor;
    }
    if (isMoving) {
      return "grab";
    }
    return "pointer";
  };

  useEvent(document, "mousemove", (e) => {
    if (isMoving) {
      removeSelection(e);
      movingHandler(e.clientX);
    }
  });

  useEventListener(
    "touchmove",
    (e) => {
      if (isMoving) {
        e.preventDefault();
      }
    },
    document.querySelector(".Calendar-Scroller"),
    { passive: false }
  );

  useEvent(document, "mouseup", (e) => {
    if (isMoving) {
      stopMoving();
    }
  });

  useEvent(document, "touchmove", (e) => {
    if (isMoving) {
      movingHandler(e.touches[0].clientX);
    }
  });

  useEvent(document, "touchend", (e) => {
    if (isMoving) {
      setIsCalendarScrollLock(false);
      stopMoving();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", (e) => {
    if (isMoving) {
      if (
        !(
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        )
      ) {
        movingHandler();
      }
    }
  });

  return (
    <When condition={taskWidth - 36 > 0}>
      <div
        id={`line-center${task._id}`}
        className={calendarStyles.moveAreaCenter + " grab"}
        style={{
          width: taskWidth - 36,
          left: 18,
          cursor: getCursor(),
        }}
        onMouseDown={startMoving}
        onTouchStart={(e) => {
          setIsCalendarScrollLock(true);
          startMoving(e);
        }}
      >
        {children}
      </div>
    </When>
  );
}
