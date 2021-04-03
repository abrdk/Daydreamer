import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect } from "react";
import useEvent from "@react-hook/event";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src//context/tasks/TasksContext";

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
  maxOffsetMove,
  minOffsetMove,
  taskWidth,
  inputRef,
  children,
}) {
  const { updateTask } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const [scrollLeft, setScrollLeft] = useState(undefined);
  const [offsetFromCenter, setOffsetFromCenter] = useState(0);

  const startMoving = (e) => {
    if (e.target != inputRef.current) {
      setIsMoving(true);
      const lineRect = lineRef.current.getBoundingClientRect();
      setOffsetFromCenter(lineRect.left + lineRect.width / 2 - e.clientX);
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

    if (offset >= maxOffsetMove || offset <= minOffsetMove) {
      setDateStart(
        new Date(
          dateStart.getFullYear(),
          dateStart.getMonth(),
          dateStart.getDate() + (Math.floor(offset / dayWidth) + 1)
        )
      );
      setDateEnd(
        new Date(
          dateEnd.getFullYear(),
          dateEnd.getMonth(),
          dateEnd.getDate() + (Math.floor(offset / dayWidth) + 1),
          23,
          59,
          59
        )
      );
    }
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

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", () => {
    if (isMoving) {
      movingHandler();
    }
  });

  useEffect(() => {
    setInitialScroll();
  }, [document.querySelector(".Calendar-Scroller"), scrollLeft]);

  return (
    <When
      condition={taskWidth - 36 > 0 && projectByQueryId.owner == userCtx._id}
    >
      <div
        className={calendarStyles.moveAreaCenter}
        style={{
          width: taskWidth - 36,
          left: 18,
          cursor: isMoving ? "grab" : "pointer",
        }}
        onMouseDown={startMoving}
      >
        {children}
      </div>
    </When>
  );
}
