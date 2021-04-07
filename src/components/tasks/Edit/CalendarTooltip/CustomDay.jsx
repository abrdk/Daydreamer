import { useContext, useState, useEffect } from "react";
import styles from "@/styles/taskEdit.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import { If, Then, Else } from "react-if";
import useEvent from "@react-hook/event";

import { TasksContext } from "@/src/context/TasksContext";

export default function CustomDay({
  day,
  date,
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  isStartCalendarOpened,
  isEndCalendarOpened,
}) {
  const { updateTask, editedTaskId, tasksByProjectId } = useContext(
    TasksContext
  );
  const task = tasksByProjectId.find((t) => t._id == editedTaskId);

  const [isMouseDown, setIsMouseDown] = useState(false);

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

  useEvent(document, "mouseup", stopSelectRange);
  useEvent(document, "mousemove", removeRanges);

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
    console.log("isMouseDown", isMouseDown);
    if (isMouseDown && isStartCalendarOpened) {
      if (dateEnd.getTime() - date.getTime() > 0) {
        console.log("date", date);
        setDateStart(date);
        console.log();
      } else {
        setDateStart(
          new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate())
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
}
