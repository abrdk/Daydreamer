import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect } from "react";
import useEvent from "@react-hook/event";
import useEventListener from "@use-it/event-listener";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

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

  const [scrollLeft, setScrollLeft] = useState(undefined);
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
    e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
  };

  const setInitialScroll = () => {
    const calendarEl = document.querySelector(".Calendar-Scroller");
    if (calendarEl && typeof scrollLeft == "undefined") {
      setScrollLeft(calendarEl.scrollLeft);
    }
  };

  const movingHandler = (clientX) => {
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

  useEvent(document, "mouseup", (e) => {
    if (isMoving) {
      stopMoving();
    }
  });

  useEvent(document, "touchmove", (e) => {
    if (isMoving) {
      removeSelection(e);
      movingHandler(e.touches[0].clientX);
    }
  });

  useEventListener(
    "touchmove",
    (e) => {
      if (isMoving) {
        e.preventDefault();
      }
    },
    document,
    { passive: false }
  );

  useEvent(document, "touchend", (e) => {
    if (isMoving) {
      stopMoving();
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", () => {
    if (isMoving) {
      movingHandler();
    }
  });

  useEffect(() => {
    setInitialScroll();
  }, [document.querySelector(".Calendar-Scroller"), scrollLeft]);

  return (
    <When condition={taskWidth - 36 > 0}>
      <div
        className={calendarStyles.moveAreaCenter + " grab"}
        style={{
          width: taskWidth - 36,
          left: 18,
          cursor: getCursor(),
        }}
        onMouseDown={startMoving}
        onTouchStart={startMoving}
      >
        {children}
      </div>
    </When>
  );
}
