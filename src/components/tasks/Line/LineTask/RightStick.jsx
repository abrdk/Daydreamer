import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useContext, useState, useEffect } from "react";
import useEvent from "@react-hook/event";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function RightStick({
  task,
  isResizeRight,
  setIsResizeRight,
  lineRef,
  dayWidth,
  dateStart,
  dateEnd,
  setDateEnd,
  maxOffsetRight,
  minOffsetRight,
  taskWidth,
}) {
  const { updateTask } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);
  const { user } = useContext(UsersContext);

  const [scrollLeft, setScrollLeft] = useState(undefined);

  const startResizeRight = () => {
    setIsResizeRight(true);
    document.body.style.cursor = "text";
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
    } else if (offset >= maxOffsetRight || offset <= minOffsetRight) {
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
      <When condition={projectByQueryId.owner == user._id}>
        <div
          className={calendarStyles.resizeAreaRight}
          onMouseDown={startResizeRight}
          style={{
            cursor: "text",
            width: taskWidth > 18 ? 18 : taskWidth == 0 ? 160 / 30 : taskWidth,
          }}
        ></div>
      </When>
    </>
  );
}
