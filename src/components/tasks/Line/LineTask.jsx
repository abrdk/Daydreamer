import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useRef } from "react";
import Truncate from "react-truncate";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";
import DateTooltip from "@/src/components/tasks/Line/LineTask/DateTooltip";
import SubtaskTooltip from "@/src/components/tasks/Line/LineTask/SubtaskTooltip";
import RightStick from "@/src/components/tasks/Line/LineTask/RightStick";
import LeftStick from "@/src/components/tasks/Line/LineTask/LeftStick";
import CenterArea from "@/src/components/tasks/Line/LineTask/CenterArea";

export default function LineTask({
  task,
  index,
  setMenu,
  editedTask,
  setEditedTask,
  calendarStartDate,
  view,
}) {
  const views = ["Day", "Week", "Month"];
  const dayWidth = [55, 120 / 7, 160 / 30];
  const extraWidth = [55, 120 / 7, 160 / 30];
  const dayLeft = [55, 120 / 7, 160 / 30];
  const extraLeft = [0, 0, 0];
  const minOffsetRight = [-70, -5, 0];
  const maxOffsetRight = [15, 5, 0];
  const minOffsetLeft = [70, 5, 0];
  const maxOffsetLeft = [-15, -5, 0];
  const minOffsetMove = [65, 5, 0];
  const maxOffsetMove = [-40, -5, 0];

  const taskTop = 20 + index * 55;

  const lineRef = useRef(null);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [taskLeft, setTaskLeft] = useState(0);
  const [taskWidth, setTaskWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const [isResizeLeft, setIsResizeLeft] = useState(false);
  const [isResizeRight, setIsResizeRight] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const setDates = () => {
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
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthLeft = (dateStart) => {
    let monthLeft = 0;
    [...Array(dateStart.getMonth() + 1).keys()].forEach((m) => {
      if (m == dateStart.getMonth()) {
        monthLeft +=
          (160 / daysInMonth(m, dateStart.getFullYear())) *
          (dateStart.getDate() - 1);
      } else {
        monthLeft += 160;
      }
    });
    return monthLeft;
  };

  const numOfDays = (dateStart, dateEnd) => {
    return Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getMonthWidth = (dateStart, dateEnd) => {
    const range = (start, stop, step = 1) =>
      Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);

    let monthWidth = 0;
    range(dateStart.getMonth(), dateEnd.getMonth() + 1).forEach((m) => {
      if (m == dateStart.getMonth() && m == dateEnd.getMonth()) {
        monthWidth +=
          (160 / daysInMonth(m, dateStart.getFullYear())) *
          (numOfDays(dateStart, dateEnd) - 1);
      } else if (m == dateStart.getMonth()) {
        monthWidth +=
          (160 / daysInMonth(m, dateStart.getFullYear())) *
          (daysInMonth(m, dateStart.getFullYear()) - dateStart.getDate() + 1);
      } else if (m == dateEnd.getMonth()) {
        monthWidth +=
          (160 / daysInMonth(m, dateEnd.getFullYear())) * dateEnd.getDate();
      } else {
        monthWidth += 160;
      }
    });
    return monthWidth;
  };

  const getTaskLeft = () => {
    if (view == "Month") {
      return getMonthLeft(dateStart);
    }
    const numOfDaysFromCalendarStart = Math.floor(
      (dateStart.getTime() - calendarStartDate.getTime()) / 1000 / 60 / 60 / 24
    );
    return (
      dayLeft[views.indexOf(view)] * numOfDaysFromCalendarStart +
      extraLeft[views.indexOf(view)]
    );
  };

  const getTaskWidth = () => {
    if (view == "Month") {
      const newTaskWidth = getMonthWidth(dateStart, dateEnd);
      if (newTaskWidth <= 0) {
        return 6;
      }
      return getMonthWidth(dateStart, dateEnd);
    }
    const taskDuration = Math.floor(
      (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
    );
    return (
      dayWidth[views.indexOf(view)] * taskDuration +
      extraWidth[views.indexOf(view)]
    );
  };

  const getPadding = () => {
    if (view != "Month") {
      if (taskWidth > 120 / 7) {
        return 8;
      }
      return 120 / 7 / 2 - 1;
    }
    if (taskWidth > (160 * 5) / 28) {
      return 8;
    } else if (taskWidth > (160 * 4) / 28) {
      return 6;
    }
    return taskWidth / 2 - 1;
  };

  useEffect(() => {
    setDates();
  }, [task.dateStart, task.dateEnd]);

  useEffect(() => {
    const newTaskLeft = getTaskLeft();
    const newTaskWidth = getTaskWidth();
    setTaskLeft(newTaskLeft);
    setTaskWidth(newTaskWidth);
    setTextWidth(newTaskWidth - 36);
  }, [dateStart, dateEnd, calendarStartDate]);

  return (
    <>
      <div
        className={calendarStyles.lineTask}
        style={{
          left: taskLeft,
          width: taskWidth,
          background: `#${task.color}`,
          top: taskTop,
          paddingLeft: getPadding(),
          paddingRight: getPadding(),
        }}
        ref={lineRef}
      >
        <DateTooltip
          isResizeLeft={isResizeLeft}
          isResizeRight={isResizeRight}
          view={view}
          dateStart={dateStart}
          dateEnd={dateEnd}
          taskWidth={taskWidth}
        />

        <SubtaskTooltip
          task={task}
          setMenu={setMenu}
          setEditedTask={setEditedTask}
        />

        <LeftStick
          task={task}
          isResizeLeft={isResizeLeft}
          setIsResizeLeft={setIsResizeLeft}
          lineRef={lineRef}
          dayWidth={dayWidth[views.indexOf(view)]}
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          maxOffsetLeft={maxOffsetLeft[views.indexOf(view)]}
          minOffsetLeft={minOffsetLeft[views.indexOf(view)]}
          view={view}
          taskWidth={taskWidth}
        />

        <When condition={textWidth > 0}>
          <Truncate lines={1} width={textWidth}>
            {task.name}
          </Truncate>
        </When>

        <CenterArea
          task={task}
          isMoving={isMoving}
          setIsMoving={setIsMoving}
          lineRef={lineRef}
          dayWidth={dayWidth[views.indexOf(view)]}
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          maxOffsetMove={maxOffsetMove[views.indexOf(view)]}
          minOffsetMove={minOffsetMove[views.indexOf(view)]}
          taskWidth={taskWidth}
        />

        <RightStick
          task={task}
          isResizeRight={isResizeRight}
          setIsResizeRight={setIsResizeRight}
          lineRef={lineRef}
          dayWidth={dayWidth[views.indexOf(view)]}
          dateStart={dateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          maxOffsetRight={maxOffsetRight[views.indexOf(view)]}
          minOffsetRight={minOffsetRight[views.indexOf(view)]}
          taskWidth={taskWidth}
        />
      </div>

      <When condition={task.isOpened}>
        <LineTasksRoot
          root={task._id}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          setMenu={setMenu}
          view={view}
          calendarStartDate={calendarStartDate}
        />
      </When>
    </>
  );
}
