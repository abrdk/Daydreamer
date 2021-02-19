import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";
import { useEffect, useState, useMemo } from "react";

import LineTasks from "@/src/components/tasks/LineTasks";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

export default function CalendarDay({
  scrollAt,
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
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
  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  };
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysComponents = useMemo(
    () =>
      [...Array(numOfDays(today.getFullYear())).keys()].map((day) => {
        let date = new Date();
        date.setMonth(0);
        date.setDate(day + 1);
        if (isSameDate(today, date)) {
          const calculatedDefaultScrollLeft = (day - 9) * 55;
          if (calculatedDefaultScrollLeft > 0) {
            setDefaultScrollLeft(calculatedDefaultScrollLeft);
          } else {
            setDefaultScrollLeft(0);
          }
        }
        return (
          <div key={`day-${day}`}>
            <div
              className={
                isSameDate(today, date)
                  ? styles.today
                  : date.getDay() == 0 || date.getDay() == 6
                  ? styles.weekend
                  : styles.day
              }
            >
              <div>{date.getDate()}</div>
              <div>{daysOfWeek[date.getDay()]}</div>
            </div>
            <When condition={isSameDate(today, date)}>
              <div className={styles.line}></div>
            </When>
          </div>
        );
      }),
    []
  );

  const numOfDaysInMonths = useMemo(
    () =>
      [...Array(12).keys()].map((m) => {
        return daysInMonth(m, today.getFullYear());
      }),
    []
  );
  const daysWithLabelsComponents = useMemo(
    () =>
      numOfDaysInMonths.map((numOfDaysInMonth, i) => {
        return (
          <div key={`month-${i}`}>
            <div className={styles.monthName}>{monthNames[i]}</div>
            <div className={styles.month}>
              {daysComponents.slice(
                numOfDaysInMonths.slice(0, i).reduce((a, sum) => a + sum, 0),
                numOfDaysInMonths.slice(0, i + 1).reduce((a, sum) => a + sum, 0)
              )}
            </div>
          </div>
        );
      }),
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
        {daysWithLabelsComponents}
        <LineTasks />
      </div>
    </Scrollbar>
  );
}
