import styles from "@/styles/calendar.module.scss";
import { Else, If, Then, When } from "react-if";
import { useEffect, useState, useMemo } from "react";

import LineTasks from "@/src/components/tasks/Line/LineTasks";
import ScrollbarDay from "@/src/components/calendar/CalendarDay/ScrollbarDay";

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
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  setMenu,
  view,
  isDefault,
}) {
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();
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

  const [defaultScrollLeft, setDefaultScrollLeft] = useState(undefined);

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const numOfDays = () => {
    return (
      Math.ceil((calendarEndDate - calendarStartDate) / (1000 * 60 * 60 * 24)) +
      1
    );
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  };

  const isCalendarWidthNotChanged = () =>
    calendarStartDate.getFullYear() == today.getFullYear() &&
    calendarStartDate.getMonth() == 0 &&
    calendarEndDate.getFullYear() == today.getFullYear();

  const daysComponents = useMemo(
    () =>
      [...Array(numOfDays()).keys()].map((day) => {
        let date = new Date();
        date.setFullYear(calendarStartDate.getFullYear());
        date.setMonth(calendarStartDate.getMonth());
        date.setDate(day + 1);
        if (isSameDate(today, date) && isCalendarWidthNotChanged()) {
          const calculatedDefaultScrollLeft = (day - 9) * 55;
          if (calculatedDefaultScrollLeft > 0) {
            setDefaultScrollLeft(calculatedDefaultScrollLeft);
          } else {
            setDefaultScrollLeft(0);
          }
        }
        return (
          <div key={`day-${day}`} style={{ position: "relative" }}>
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
            <div
              className={
                date.getDay() == 0 || date.getDay() == 6
                  ? styles.dashedContainerWeekend
                  : styles.dashedContainer
              }
            ></div>
            <When condition={isSameDate(today, date)}>
              <div className={styles.line}></div>
            </When>
          </div>
        );
      }),
    [calendarStartDate, calendarEndDate]
  );

  const numOfDaysInMonths = useMemo(
    () =>
      [...Array(numOfMonths(calendarStartDate, calendarEndDate)).keys()].map(
        (m) => {
          return daysInMonth(
            calendarStartDate.getMonth() + m,
            calendarStartDate.getFullYear()
          );
        }
      ),
    [calendarStartDate, calendarEndDate]
  );

  const daysWithLabelsComponents = useMemo(
    () =>
      numOfDaysInMonths.map((numOfDaysInMonth, i) => {
        return (
          <div className="month" key={`month-${i}`}>
            <div className={styles.monthName}>
              {monthNames[(calendarStartDate.getMonth() + i) % 12]}
            </div>
            <div className={styles.month}>
              {daysComponents.slice(
                numOfDaysInMonths.slice(0, i).reduce((a, sum) => a + sum, 0),
                numOfDaysInMonths.slice(0, i + 1).reduce((a, sum) => a + sum, 0)
              )}
            </div>
          </div>
        );
      }),
    [calendarStartDate, calendarEndDate]
  );

  useEffect(() => {
    if (typeof defaultScrollLeft != "undefined") {
      setDefaultScrollLeft(undefined);
    }
  }, [defaultScrollLeft]);

  return (
    <If condition={isDefault}>
      <Then>
        <div className={styles.wrapper}>{daysWithLabelsComponents}</div>
      </Then>
      <Else>
        <ScrollbarDay
          cursor={cursor}
          setCursor={setCursor}
          isDraggable={isDraggable}
          setDraggable={setDraggable}
          calendarStartDate={calendarStartDate}
          setCalendarStartDate={setCalendarStartDate}
          calendarEndDate={calendarEndDate}
          setCalendarEndDate={setCalendarEndDate}
          defaultScrollLeft={defaultScrollLeft}
        >
          {daysWithLabelsComponents}
          <LineTasks
            calendarStartDate={calendarStartDate}
            setMenu={setMenu}
            view={view}
          />
        </ScrollbarDay>
      </Else>
    </If>
  );
}
