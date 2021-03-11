import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect } from "react";
import useEvent from "@react-hook/event";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LeftStick({
  task,
  isResizeLeft,
  setIsResizeLeft,
  lineRef,
  dayWidth,
  dateStart,
  setDateStart,
  dateEnd,
  maxOffsetLeft,
  minOffsetLeft,
}) {
  const { updateTask } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const [scrollLeft, setScrollLeft] = useState(undefined);

  const startResizeLeft = () => {
    setIsResizeLeft(true);
    document.body.style.cursor = "grab";
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
    } else if (offset >= maxOffsetLeft || offset <= minOffsetLeft) {
      const newDateStart = new Date(
        dateStart.getFullYear(),
        dateStart.getMonth(),
        dateStart.getDate() + Math.floor(offset / dayWidth)
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
    <>
      <When condition={projectByQueryId.owner == userCtx._id}>
        <div
          className={calendarStyles.resizeAreaLeft}
          onMouseDown={startResizeLeft}
          style={{
            cursor: isResizeLeft ? "grab" : "pointer",
          }}
        ></div>
      </When>
      <div className={calendarStyles.stick}></div>
    </>
  );
}
