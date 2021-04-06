import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useMemo, useState } from "react";

import LineTasks from "@/src/components/tasks/Line/LineTasks";
import ScrollbarMonth from "@/src/components/calendar/CalendarMonth/ScrollbarMonth";

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

export default function CalendarMonth({
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  setMenu,
}) {
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();

  const [calendarStartDate, setCalendarStartDate] = useState(
    new Date(today.getFullYear() - 1, 0, 1)
  );
  const [calendarEndDate, setCalendarEndDate] = useState(
    new Date(
      today.getFullYear() + 1,
      11,
      daysInMonth(today.getFullYear(), 11),
      23,
      59,
      59
    )
  );

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const isSameMonth = (date1, date2) => {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth()
    );
  };

  const monthsComponents = useMemo(
    () =>
      [...Array(numOfMonths(calendarStartDate, calendarEndDate)).keys()].map(
        (month) => {
          let date = new Date();
          date.setFullYear(calendarStartDate.getFullYear());
          date.setMonth(month);
          date.setDate(1);
          return (
            <div
              key={`month-${month}`}
              style={{ position: "relative" }}
              className="month"
            >
              <div
                className={
                  isSameMonth(new Date(), date)
                    ? styles.monthCurrent
                    : styles.monthWrapper
                }
              >
                <div>{monthNames[month % 12]}</div>
              </div>
              <When condition={isSameMonth(new Date(), date)}>
                <div
                  className={styles.monthLine}
                  style={{
                    left:
                      (160 / daysInMonth(month, date.getFullYear())) *
                      (new Date().getDate() - 1),
                  }}
                ></div>
              </When>
              <div className={styles.dashedContainerMonth}></div>
            </div>
          );
        }
      ),
    [calendarStartDate, calendarEndDate]
  );

  const monthsWithLabelsComponents = useMemo(
    () =>
      [
        ...Array(
          calendarEndDate.getFullYear() - calendarStartDate.getFullYear() + 1
        ).keys(),
      ].map((year) => {
        let date = new Date();
        date.setFullYear(calendarStartDate.getFullYear() + year);
        return (
          <div key={`year-${year}`}>
            <div className={styles.monthName}>{date.getFullYear()}</div>
            <div className={styles.month}>
              {monthsComponents.slice(12 * year, 12 + 12 * year)}
            </div>
          </div>
        );
      }),
    [calendarStartDate, calendarEndDate]
  );

  return (
    <ScrollbarMonth
      cursor={cursor}
      setCursor={setCursor}
      isDraggable={isDraggable}
      setDraggable={setDraggable}
      calendarStartDate={calendarStartDate}
      setCalendarStartDate={setCalendarStartDate}
      calendarEndDate={calendarEndDate}
      setCalendarEndDate={setCalendarEndDate}
    >
      {monthsWithLabelsComponents}
      <LineTasks calendarStartDate={calendarStartDate} />
    </ScrollbarMonth>
  );
}
