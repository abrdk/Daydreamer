import { useContext, useState, useEffect } from "react";
import styles from "@/styles/taskEdit.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function TasksEdit({ task }) {
  const { updateTask } = useContext(TasksContext);

  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  useEffect(() => {
    if (task) {
      if (typeof task.dateStart == "string") {
        setDateStart(new Date(task.dateStart));
      } else {
        setDateStart(task.dateStart);
      }
      if (typeof task.dateEnd == "string") {
        setDateEnd(new Date(task.dateEnd));
      } else {
        setDateEnd(task.dateEnd);
      }
    }
  }, [task]);

  const customDay = (day, date) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const numOfDaysFromToday =
      (today.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    const numOfDaysFromDateStart =
      (dateStart.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    const numOfDaysFromDateEnd =
      (dateEnd.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    const getClassName = () => {
      if (
        numOfDaysFromDateStart < 1 &&
        numOfDaysFromDateStart >= 0 &&
        numOfDaysFromDateEnd < 1 &&
        numOfDaysFromDateEnd > 0
      ) {
        return styles.dayStartEnd;
      }
      if (numOfDaysFromDateStart < 1 && numOfDaysFromDateStart >= 0) {
        return styles.dayStart;
      }
      if (numOfDaysFromDateEnd < 1 && numOfDaysFromDateEnd > 0) {
        return styles.dayEnd;
      }
      if (numOfDaysFromToday > 1) {
        if (numOfDaysFromDateEnd > 0 && numOfDaysFromDateStart < 1) {
          return styles.dayPast + " " + styles.dayBetween;
        }
        return styles.dayPast;
      } else {
        if (numOfDaysFromDateEnd > 0 && numOfDaysFromDateStart < 1) {
          return styles.dayFuture + " " + styles.dayBetween;
        }
        return styles.dayFuture;
      }
    };
    return <div className={getClassName()}>{day}</div>;
  };

  const customHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className={styles.calendarHeader}>
      <img
        src="/img/calendarArrowLeft.svg"
        onClick={decreaseMonth}
        className={styles.arrowLeft}
      />
      <div>{monthNames[date.getMonth()]}</div>
      <img
        src="/img/calendarArrowRight.svg"
        onClick={increaseMonth}
        className={styles.arrowRight}
      />
    </div>
  );

  return (
    <div className={styles.datesWrapper}>
      <DatePicker
        selected={dateStart}
        onChange={(date) => {
          setDateStart(date);
          updateTask({ ...task, dateStart: date });
        }}
        selectsStart
        startDate={dateStart}
        endDate={dateEnd}
        className={styles.dateWrapper}
        dateFormat="MMMM d, yyyy"
        calendarClassName={styles.calendar}
        popperPlacement="top-start"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: "0px, 9px",
          },
        }}
        maxDate={dateEnd}
        shouldCloseOnSelect={false}
        renderDayContents={customDay}
        renderCustomHeader={customHeader}
      />
      <div className={styles.dateDash}></div>
      <DatePicker
        selected={dateEnd}
        onChange={(date) => {
          setDateEnd(date);
          updateTask({ ...task, dateEnd: date });
        }}
        selectsEnd
        startDate={dateStart}
        endDate={dateEnd}
        minDate={dateStart}
        className={styles.dateWrapper}
        dateFormat="MMMM d, yyyy"
        calendarClassName={styles.calendar}
        popperPlacement="top-start"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: "0px, 9px",
          },
        }}
        shouldCloseOnSelect={false}
        renderDayContents={customDay}
        renderCustomHeader={customHeader}
      />
    </div>
  );
}
