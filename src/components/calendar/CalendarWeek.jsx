import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useState, useMemo, memo } from "react";

import LineTasks from "@/src/components/tasks/Line/LineTasks";
import ScrollbarWeek from "@/src/components/calendar/CalendarWeek/ScrollbarWeek";

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

function CalendarWeek({ cursor, setCursor, isDraggable, setDraggable }) {
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();
  today.setDate(today.getDate() + 7);

  const [calendarStartDate, setCalendarStartDate] = useState(
    new Date(today.getFullYear(), 0, 1)
  );
  const [calendarEndDate, setCalendarEndDate] = useState(
    new Date(
      today.getFullYear(),
      11,
      daysInMonth(today.getFullYear(), 11),
      23,
      59,
      59
    )
  );

  const numOfDays = () => {
    return (
      Math.ceil((calendarEndDate - calendarStartDate) / (1000 * 60 * 60 * 24)) +
      1
    );
  };

  const isDayBetweenTwoDays = (day, weekStart, weekEnd) => {
    return (
      day.getTime() - weekStart.getTime() > -24 * 60 * 60 * 1000 &&
      weekEnd.getTime() - day.getTime() > 0
    );
  };

  const weeksComponents = useMemo(
    () =>
      [...Array(numOfDays()).keys()]
        .map((day) => {
          let date = new Date();
          date.setFullYear(calendarStartDate.getFullYear());
          date.setMonth(calendarStartDate.getMonth());
          date.setDate(day + 1);
          let weekLater = new Date();
          weekLater.setFullYear(calendarStartDate.getFullYear());
          weekLater.setMonth(calendarStartDate.getMonth());
          weekLater.setDate(day + 7);
          weekLater.setHours(23);
          weekLater.setMinutes(59);
          weekLater.setSeconds(59);
          if (day == 0) {
            const dayOfWeek = (date.getDay() + 6) % 7;
            date.setDate(1 - dayOfWeek);
            weekLater.setDate(7 - dayOfWeek);
          }
          if (date.getDay() == 1) {
            return (
              <div key={`week-${day}`} style={{ position: "relative" }}>
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
                  <div
                    className={styles.weekLine}
                    style={{
                      left:
                        (Math.ceil(
                          (today.getTime() - date.getTime()) /
                            1000 /
                            60 /
                            60 /
                            24
                        ) *
                          120) /
                        7,
                    }}
                  ></div>
                </When>
                <div className={styles.dashedContainerWeek}></div>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    [calendarStartDate, calendarEndDate]
  );

  const isWeekStartOfMonth = (weekStart) => {
    return (
      daysInMonth(weekStart.getMonth(), today.getFullYear()) -
        weekStart.getDate() <
        6 || weekStart.getDate() == 1
    );
  };

  const isWeekStartOfMonthArr = useMemo(
    () =>
      [...Array(numOfDays()).keys()]
        .map((day) => {
          let date = new Date();
          date.setFullYear(calendarStartDate.getFullYear());
          date.setMonth(calendarStartDate.getMonth());
          date.setDate(day + 1);
          if (day == 0) {
            const dayOfWeek = (date.getDay() + 6) % 7;
            date.setDate(1 - dayOfWeek);
          }
          if (date.getDay() == 1) {
            if (isWeekStartOfMonth(date)) {
              return true;
            }
            return false;
          }
        })
        .filter((bool) => typeof bool !== "undefined"),
    [calendarStartDate, calendarEndDate]
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
                  {
                    monthNames[
                      (calendarStartDate.getMonth() + monthIndex - 1) % 12
                    ]
                  }
                </div>
                <div className={styles.month}>
                  {weeksComponents.slice(i, i + numOfWeeksInMonth)}
                </div>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    [calendarStartDate, calendarEndDate]
  );

  return (
    <ScrollbarWeek
      cursor={cursor}
      setCursor={setCursor}
      isDraggable={isDraggable}
      setDraggable={setDraggable}
      calendarStartDate={calendarStartDate}
      setCalendarStartDate={setCalendarStartDate}
      calendarEndDate={calendarEndDate}
      setCalendarEndDate={setCalendarEndDate}
    >
      {weeksWithLabelsComponents}
      <LineTasks
        calendarStartDate={
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth(),
            1 - ((calendarStartDate.getDay() + 6) % 7)
          )
        }
        calendarEndDate={calendarEndDate}
      />
    </ScrollbarWeek>
  );
}

CalendarWeek = memo(
  CalendarWeek,
  (prevProps, nextProps) =>
    prevProps.cursor == nextProps.cursor &&
    prevProps.isDraggable == nextProps.isDraggable
);

export default CalendarWeek;
