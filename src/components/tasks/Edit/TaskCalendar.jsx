import { useContext, useState, useEffect } from "react";
import styles from "@/styles/taskEdit.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { If, Then, Else } from "react-if";

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

import { TasksContext } from "@/src/context/TasksContext";
import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import useEvent from "@react-hook/event";

export default function TasksCalendar({ task }) {
  const { projectByQueryId } = useContext(ProjectsContext);
  const { user } = useContext(UsersContext);

  const { updateTask } = useContext(TasksContext);

  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  useEvent(document, "mouseup", () => {
    if (isMouseDown) {
      updateTask({ ...task, dateStart, dateEnd });
      setIsMouseDown(false);
    }
  });
  useEvent(document, "mousemove", (e) => {
    if (isMouseDown && (isStartCalendarOpened || isEndCalendarOpened)) {
      try {
        e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
      } catch (e) {}
    }
  });

  const [isStartCalendarOpened, setIsStartCalendarOpened] = useState(false);
  const [isEndCalendarOpened, setIsEndCalendarOpened] = useState(false);

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

    const handleMouseDown = (e, date) => {
      setIsMouseDown(true);
      handleMouseEnter(true, date);
    };

    const handleMouseEnter = (isMouseDown, date) => {
      if (isMouseDown && isStartCalendarOpened) {
        if (dateEnd.getTime() - date.getTime() > 0) {
          setDateStart(date);
        } else {
          setDateStart(
            new Date(
              dateEnd.getFullYear(),
              dateEnd.getMonth(),
              dateEnd.getDate()
            )
          );
        }
      } else if (isMouseDown && isEndCalendarOpened) {
        if (date.getTime() - dateStart.getTime() > 0) {
          date.setSeconds(60 * 60 * 24 - 1);
          setDateEnd(date);
        } else {
          setDateEnd(
            new Date(
              dateStart.getFullYear(),
              dateStart.getMonth(),
              dateStart.getDate(),
              23,
              59,
              59
            )
          );
        }
      }
    };

    const dayClassName = getClassName();

    return (
      <div
        className={dayClassName}
        onMouseDown={(e) => handleMouseDown(e, date)}
        onMouseEnter={() => handleMouseEnter(isMouseDown, date)}
      >
        <If
          condition={
            dayClassName == styles.dayPast || dayClassName == styles.dayFuture
          }
        >
          <Then>
            <div className={styles.dayCircle}>{day}</div>
          </Then>
          <Else>{day}</Else>
        </If>
      </div>
    );
  };

  const customHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className={styles.calendarHeader}>
      <img
        src="/img/calendarArrowLeft.svg"
        onClick={decreaseMonth}
        className={styles.arrowLeft}
        alt="prev"
      />
      <div>{monthNames[date.getMonth()]}</div>
      <img
        src="/img/calendarArrowRight.svg"
        onClick={increaseMonth}
        className={styles.arrowRight}
        alt="next"
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
        disabled={projectByQueryId.owner != user._id ? true : false}
        onCalendarClose={() => setIsStartCalendarOpened(false)}
        onCalendarOpen={() => setIsStartCalendarOpened(true)}
      />
      <div className={styles.dateDash}></div>
      <DatePicker
        selected={dateEnd}
        onChange={(date) => {
          date.setSeconds(60 * 60 * 24 - 1);
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
        disabled={projectByQueryId.owner != user._id ? true : false}
        onCalendarClose={() => setIsEndCalendarOpened(false)}
        onCalendarOpen={() => setIsEndCalendarOpened(true)}
      />
    </div>
  );
}
