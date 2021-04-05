import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState, useContext } from "react";
import useEvent from "@react-hook/event";
import styles from "@/styles/calendar.module.scss";

import { TasksContext } from "@/src/context/TasksContext";

export default function ScrollbarDay({
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  calendarStartDate,
  setCalendarStartDate,
  calendarEndDate,
  setCalendarEndDate,
  defaultScrollLeft,
  children,
}) {
  const { tasksByProjectId } = useContext(TasksContext);

  const [isMouseDown, setIsMouseDown] = useState(false);
  useEvent(document, "mousedown", () => setIsMouseDown(true));
  useEvent(document, "mouseup", () => setIsMouseDown(false));

  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const startScrollHandler = (e) => {
    if (cursor == "pointer") {
      setInitialScrollLeft(e.clientX);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
    }
  };

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

  const stopScrollHandler = (scrollValues) => {
    if (!isMouseDown) {
      const firstMonthWidth =
        daysInMonth(
          calendarStartDate.getMonth(),
          calendarStartDate.getFullYear()
        ) * 55;
      const lastMonthWidth =
        daysInMonth(calendarEndDate.getMonth(), calendarEndDate.getFullYear()) *
        55;
      if (scrollValues.scrollLeft < firstMonthWidth) {
        const numOfDays = [...Array(3).keys()].map((i) =>
          daysInMonth(
            calendarStartDate.getMonth() - i - 1,
            calendarStartDate.getFullYear()
          )
        );

        document
          .querySelector(".Calendar-Scroller")
          .scrollBy(numOfDays.reduce((sum, num) => sum + num, 0) * 55, 0);
        setCalendarStartDate(
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() - 3,
            1
          )
        );
        document.querySelector("#linesWrapper").style.paddingLeft =
          numOfDays.reduce((sum, num) => sum + num, 0) * 55 + "px";
      } else if (
        scrollValues.contentScrollWidth -
          scrollValues.clientWidth -
          scrollValues.scrollLeft <
        lastMonthWidth
      ) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear(),
            calendarEndDate.getMonth() + 3,
            daysInMonth(
              calendarEndDate.getFullYear(),
              calendarEndDate.getMonth() + 3
            ),
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
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() -
              numOfMonths(earliestDate, calendarStartDate) +
              1,
            1
          )
        );
        const numOfDays = [
          ...Array(numOfMonths(earliestDate, calendarStartDate) - 1).keys(),
        ].map((i) =>
          daysInMonth(
            calendarStartDate.getMonth() - i - 1,
            calendarStartDate.getFullYear()
          )
        );
        document
          .querySelector(".Calendar-Scroller")
          .scrollBy(numOfDays.reduce((sum, num) => sum + num, 0) * 55, 0);
        document.querySelector("#linesWrapper").style.paddingLeft =
          numOfDays.reduce((sum, num) => sum + num, 0) * 55 + "px";
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
            calendarEndDate.getFullYear(),
            calendarEndDate.getMonth() +
              numOfMonths(calendarEndDate, latestDate) -
              1,
            daysInMonth(
              calendarEndDate.getFullYear(),
              calendarEndDate.getMonth() +
                numOfMonths(calendarEndDate, latestDate) -
                1
            ),
            23,
            59,
            59
          )
        );
      }
    }
  }, [tasksByProjectId]);

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

  useEffect(() => {
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  }, []);

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      scrollLeft={defaultScrollLeft}
      noScrollY={true}
      style={{ height: "calc(100vh - 89px - 0px)", width: "100vw" }}
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
