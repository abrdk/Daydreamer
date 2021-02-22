import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";
import { useEffect, useState, useMemo } from "react";

import LineTasks from "@/src/components/tasks/LineTasks";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarWeek({
  scrollAt,
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  setMenu,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
  view,
}) {
  const [defaultScrollLeft, setDefaultScrollLeft] = useState(undefined);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const startScrollHandler = () => {
    if (cursor == "pointer") {
      setInitialScrollLeft(scrollAt);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
    }
  };
  const stopScrollHandler = (scrollValues) => {
    if (cursor != "grab") {
      setScrollLeft(scrollValues.scrollLeft);
    }
  };
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  };
  useEffect(() => {
    const calculatedDefaultScrollLeft = (getWeekNumber(new Date()) - 4) * 120;
    if (calculatedDefaultScrollLeft > 0) {
      setDefaultScrollLeft(calculatedDefaultScrollLeft);
    } else {
      setDefaultScrollLeft(0);
    }
  }, []);
  useEffect(() => {
    if (typeof defaultScrollLeft != "undefined") {
      setDefaultScrollLeft(undefined);
    }
  }, [defaultScrollLeft]);

  const today = new Date();
  const isLeapYear = (year) => {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  };
  const numOfDays = (year) => {
    return isLeapYear(year) ? 366 : 365;
  };
  const isDayBetweenTwoDays = (day, weekStart, weekEnd) => {
    return (
      day.getTime() - weekStart.getTime() > 0 &&
      weekEnd.getTime() - day.getTime() > 0
    );
  };
  const weeksComponents = useMemo(
    () =>
      [...Array(numOfDays(today.getFullYear())).keys()]
        .map((day) => {
          let date = new Date();
          date.setMonth(0);
          date.setDate(day + 1);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          let weekLater = new Date();
          weekLater.setMonth(0);
          weekLater.setDate(day + 7);
          weekLater.setHours(23);
          weekLater.setMinutes(59);
          weekLater.setSeconds(59);
          if (day == 0) {
            const dayOfWeek = date.getDay();
            date.setDate(day + 1 - dayOfWeek + 1);
            weekLater.setDate(day + 7 - dayOfWeek + 1);
          }
          if (date.getDay() == 1) {
            return (
              <div key={`week-${day}`}>
                <div
                  className={
                    isDayBetweenTwoDays(today, date, weekLater)
                      ? styles.weekCurrent
                      : styles.week
                  }
                >
                  <div>{`${date.getDate()} - ${weekLater.getDate()}`}</div>
                </div>
                <When condition={isDayBetweenTwoDays(today, date, weekLater)}>
                  <div className={styles.weekLine}></div>
                </When>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    []
  );

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isWeekStartOfMonth = (weekStart) => {
    return (
      daysInMonth(weekStart.getMonth(), today.getFullYear()) -
        weekStart.getDate() <
        6 || weekStart.getDate() == 1
    );
  };

  const isWeekStartOfMonthArr = useMemo(
    () =>
      [...Array(numOfDays(today.getFullYear())).keys()]
        .map((day) => {
          let date = new Date();
          date.setMonth(0);
          date.setDate(day + 1);
          if (day == 0) {
            const dayOfWeek = date.getDay();
            date.setDate(day + 1 - dayOfWeek + 1);
          }
          if (date.getDay() == 1) {
            if (isWeekStartOfMonth(date)) {
              return true;
            }
            return false;
          }
        })
        .filter((bool) => typeof bool !== "undefined"),
    []
  );

  const weeksWithLabelsComponents = useMemo(
    () =>
      isWeekStartOfMonthArr
        .map((bool, i) => {
          if (bool) {
            let numOfWeeksInMonth = 1;
            isWeekStartOfMonthArr.slice(i + 1, i + 5).forEach((b) => {
              if (!b) {
                numOfWeeksInMonth += 1;
              }
            });

            const monthIndex = isWeekStartOfMonthArr
              .slice(0, i + 1)
              .reduce((sum, bool) => {
                if (bool) {
                  return sum + 1;
                }
                return sum;
              }, 0);
            return (
              <div key={`month-${i}`} className="month">
                <div className={styles.monthName}>
                  {monthNames[monthIndex - 1]}
                </div>
                <div className={styles.month}>
                  {weeksComponents.slice(i, i + numOfWeeksInMonth)}
                </div>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    []
  );

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      scrollLeft={
        isDraggable
          ? scrollLeft - scrollAt + initialScrollLeft
          : defaultScrollLeft
      }
      noScrollY={true}
      style={{ height: "calc(100vh - 89px - 10px)", width: "100vw" }}
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
        {weeksWithLabelsComponents}
        <LineTasks
          setMenu={setMenu}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          isSubtasksOpened={isSubtasksOpened}
          setIsSubtasksOpened={setIsSubtasksOpened}
          view={view}
        />
      </div>
    </Scrollbar>
  );
}
