import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState, useContext } from "react";
import useEvent from "@react-hook/event";

import { TasksContext } from "@/src/context/TasksContext";

export default function CalendarMonth({
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  calendarStartDate,
  setCalendarStartDate,
  calendarEndDate,
  setCalendarEndDate,
  children,
}) {
  const { tasksByProjectId } = useContext(TasksContext);

  const [isMouseDown, setIsMouseDown] = useState(false);
  useEvent(document, "mousedown", () => setIsMouseDown(true));
  useEvent(document, "mouseup", () => setIsMouseDown(false));

  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const startScrollHandler = (e) => {
    if (cursor == "pointer") {
      setInitialScrollLeft(e.clientX);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
    }
  };

  const stopScrollHandler = (scrollValues) => {
    if (!isMouseDown || isDraggable) {
      const monthWidth = 160;
      if (scrollValues.scrollLeft < monthWidth) {
        document.querySelector(".Calendar-Scroller").scrollBy(160 * 12, 0);
        setCalendarStartDate(
          new Date(calendarStartDate.getFullYear() - 1, 0, 1)
        );
        document.querySelector("#linesWrapper").style.paddingLeft =
          160 * 12 + "px";
      } else if (
        scrollValues.contentScrollWidth -
          scrollValues.clientWidth -
          scrollValues.scrollLeft <
        monthWidth
      ) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear() + 1,
            11,
            daysInMonth(calendarEndDate.getFullYear() + 1, 11),
            23,
            59,
            59
          )
        );
      }
    }
  };

  useEffect(() => {
    if (tasksByProjectId.length) {
      const startDates = tasksByProjectId.map((t) => {
        if (typeof t.dateStart == "string") {
          return new Date(t.dateStart);
        }
        return t.dateStart;
      });
      startDates.sort((t1, t2) => t1.getTime() - t2.getTime());
      const earliestDate = startDates[0];
      if (calendarStartDate.getTime() - earliestDate.getTime() > 0) {
        setCalendarStartDate(
          new Date(calendarStartDate.getFullYear() - 1, 0, 1)
        );
        document.querySelector(".Calendar-Scroller").scrollBy(160 * 12, 0);
        document.querySelector("#linesWrapper").style.paddingLeft =
          160 * 12 + "px";
      }

      const endDates = tasksByProjectId.map((t) => {
        if (typeof t.dateEnd == "string") {
          return new Date(t.dateEnd);
        }
        return t.dateEnd;
      });
      endDates.sort((t1, t2) => t2.getTime() - t1.getTime());
      const latestDate = endDates[0];
      if (latestDate.getTime() - calendarEndDate.getTime() > 0) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear() + 1,
            11,
            daysInMonth(calendarEndDate.getFullYear() + 1, 11),
            23,
            59,
            59
          )
        );
      }
    }
  }, [tasksByProjectId]);

  useEffect(() => {
    const today = new Date();
    const calculatedDefaultScrollLeft =
      (numOfMonths(calendarStartDate, today) - 4) * 160;
    if (calculatedDefaultScrollLeft > 0) {
      document
        .querySelector(".Calendar-Scroller")
        .scrollBy(calculatedDefaultScrollLeft, 0);
    }
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  }, []);

  const scrollByMouse = (e) => {
    e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
    document
      .querySelector(".Calendar-Scroller")
      .scrollBy(-e.clientX + initialScrollLeft, 0);
    setInitialScrollLeft(e.clientX);
  };

  useEvent(document, "mousemove", (e) => {
    if (isDraggable) {
      scrollByMouse(e);
    }
  });

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      noScrollY={true}
      style={{ height: "calc(100vh - 89px)", width: "100vw" }}
      trackXProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return (
            <span
              {...restProps}
              ref={elementRef}
              className="ScrollbarsCustom-Track ScrollbarsCustom-TrackX ScrollbarsCustom-Calendar"
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
              className="ScrollbarsCustom-Scroller Calendar-Scroller"
            />
          );
        },
      }}
    >
      <div
        onMouseDown={startScrollHandler}
        className={
          cursor == "pointer"
            ? styles.wrapperPointer
            : cursor == "grab"
            ? styles.wrapperGrab
            : styles.wrapper
        }
      >
        {children}
      </div>
    </Scrollbar>
  );
}
