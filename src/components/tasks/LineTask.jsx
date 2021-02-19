import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";

export default function LineTask({ task, index }) {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  const numOfDaysFrom1January = Math.floor(
    (dateStart.getTime() - startOfYear.getTime()) / 1000 / 60 / 60 / 24
  );
  const taskDuration = Math.floor(
    (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
  );

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

  return (
    <div
      className={styles.lineTask}
      style={{
        left: 55 * numOfDaysFrom1January + 6.5,
        width: 55 * taskDuration + 42,
        background: `#${task.color}`,
        top: 88 + index * 55,
      }}
    >
      {task.name}
    </div>
  );
}
