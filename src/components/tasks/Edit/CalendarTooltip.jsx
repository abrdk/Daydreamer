import { useContext, useState, useEffect, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { If, Then, Else } from "react-if";
import useEvent from "@react-hook/event";

import CalendarArrowLeftSvg from "@/src/components/svg/CalendarArrowLeftSvg";
import CalendarArrowRightSvg from "@/src/components/svg/CalendarArrowRightSvg";

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
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerCalendarTooltip({ task, isUserOwnsProject, updateTask }) {
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const [isStartCalendarOpened, setIsStartCalendarOpened] = useState(false);
  const [isEndCalendarOpened, setIsEndCalendarOpened] = useState(false);

  const stopSelectRange = () => {
    if (isMouseDown) {
      updateTask({ ...task, dateStart, dateEnd });
      setIsMouseDown(false);
    }
  };

  const removeRanges = (e) => {
    if (isMouseDown && (isStartCalendarOpened || isEndCalendarOpened)) {
      try {
        e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
      } catch (e) {}
    }
  };

  const synchronizeDates = () => {
    if (task) {
      if (typeof task.dateStart == "string") {
        const fixedDateStart = new Date(task.dateStart);
        fixedDateStart.setHours(0);
        fixedDateStart.setMinutes(0);
        fixedDateStart.setSeconds(0);
        setDateStart(fixedDateStart);
      } else {
        const fixedDateStart = new Date(
          task.dateStart.getFullYear(),
          task.dateStart.getMonth(),
          task.dateStart.getDate()
        );
        setDateStart(fixedDateStart);
      }
      if (typeof task.dateEnd == "string") {
        const fixedDateEnd = new Date(task.dateEnd);
        fixedDateEnd.setHours(23);
        fixedDateEnd.setMinutes(59);
        fixedDateEnd.setSeconds(59);
        setDateEnd(fixedDateEnd);
      } else {
        const fixedDateEnd = new Date(
          task.dateEnd.getFullYear(),
          task.dateEnd.getMonth(),
          task.dateEnd.getDate()
        );
        fixedDateEnd.setSeconds(60 * 60 * 24 - 1);
        setDateEnd(fixedDateEnd);
      }
    }
  };

  const handleDateStartUpdate = (date) => {
    const newDateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    setDateStart(newDateStart);
    updateTask({ ...task, dateStart: newDateStart });
  };

  const handleDateEndUpdate = (date) => {
    const newDateEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    newDateEnd.setSeconds(60 * 60 * 24 - 1);
    setDateEnd(newDateEnd);
    updateTask({ ...task, dateEnd: newDateEnd });
  };

  useEvent(document, "mouseup", stopSelectRange);
  useEvent(document, "mousemove", removeRanges);

  useEffect(() => {
    synchronizeDates();
  }, [task]);

  const customDay = (day, date) => {
    const today = new Date();

    const numOfDaysFromToday =
      (today.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    const numOfDaysFromDateStart =
      (dateStart.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    const numOfDaysFromDateEnd =
      (dateEnd.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;

    const getDayClassName = () => {
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
          const newDateStart = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          setDateStart(newDateStart);
          updateTask({ ...task, dateStart: newDateStart });
        } else {
          const newDateStart = new Date(
            dateEnd.getFullYear(),
            dateEnd.getMonth(),
            dateEnd.getDate()
          );
          setDateStart(newDateStart);
          updateTask({ ...task, dateStart: newDateStart });
        }
      } else if (isMouseDown && isEndCalendarOpened) {
        if (date.getTime() - dateStart.getTime() > 0) {
          const newDateEnd = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          newDateEnd.setSeconds(60 * 60 * 24 - 1);
          setDateEnd(newDateEnd);
          updateTask({ ...task, dateEnd: newDateEnd });
        } else {
          const newDateEnd = new Date(
            dateStart.getFullYear(),
            dateStart.getMonth(),
            dateStart.getDate(),
            23,
            59,
            59
          );
          setDateEnd(newDateEnd);
          updateTask({ ...task, dateEnd: newDateEnd });
        }
      }
    };

    const dayClassName = getDayClassName();

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
      <div onClick={decreaseMonth} className={styles.arrowLeft}>
        <CalendarArrowLeftSvg />
      </div>
      <div>{monthNames[date.getMonth()]}</div>
      <div onClick={increaseMonth} className={styles.arrowRight}>
        <CalendarArrowRightSvg />
      </div>
    </div>
  );

  return (
    <div className={styles.datesWrapper}>
      <DatePicker
        selected={dateStart}
        onChange={handleDateStartUpdate}
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
        disabled={isUserOwnsProject ? false : true}
        onCalendarClose={() => setIsStartCalendarOpened(false)}
        onCalendarOpen={() => setIsStartCalendarOpened(true)}
      />
      <div className={styles.dateDash}></div>
      <DatePicker
        selected={dateEnd}
        onChange={handleDateEndUpdate}
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
        disabled={isUserOwnsProject ? false : true}
        onCalendarClose={() => setIsEndCalendarOpened(false)}
        onCalendarOpen={() => setIsEndCalendarOpened(true)}
      />
    </div>
  );
}

InnerCalendarTooltip = memo(InnerCalendarTooltip, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return prevProps.isUserOwnsProject == nextProps.isUserOwnsProject;
});

export default function CalendarTooltip({ task }) {
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const { updateTask } = useContext(TasksContext);
  return <InnerCalendarTooltip {...{ task, isUserOwnsProject, updateTask }} />;
}
