import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useRef, useContext, memo } from "react";
import useEvent from "@react-hook/event";
import useMedia from "use-media";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";
import DateTooltip from "@/src/components/tasks/Line/LineTask/DateTooltip";
import SubtaskTooltip from "@/src/components/tasks/Line/LineTask/SubtaskTooltip";
import RightStick from "@/src/components/tasks/Line/LineTask/RightStick";
import LeftStick from "@/src/components/tasks/Line/LineTask/LeftStick";
import CenterArea from "@/src/components/tasks/Line/LineTask/CenterArea";
import LineTaskName from "@/src/components/tasks/Line/LineTask/LineTaskName";

import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

const views = ["Day", "Week", "Month"];
const dayWidth = [55, 120 / 7, 160 / 30];
const dayWidthMobile = [42, 91 / 7, 91 / 30];

function InnerLineTask({ task, calendarStartDate, view, setEditedTaskId }) {
  const isMobile = useMedia({ maxWidth: 1200 });

  const lineRef = useRef(null);
  const inputRef = useRef(null);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [taskLeft, setTaskLeft] = useState(0);
  const [taskWidth, setTaskWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const [isResizeLeft, setIsResizeLeft] = useState(false);
  const [isResizeRight, setIsResizeRight] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const [globalCursor, setGlobalCursor] = useState("");

  const { editedTaskId, isTaskOpened } = useContext(TasksContext);

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

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const getMonthLeft = (dateStart) => {
    let monthLeft =
      (isMobile ? 91 : 160) * (numOfMonths(calendarStartDate, dateStart) - 1);
    monthLeft +=
      ((isMobile ? 91 : 160) /
        daysInMonth(dateStart.getMonth(), dateStart.getFullYear())) *
      (dateStart.getDate() - 1);
    return monthLeft;
  };

  const numOfDays = (dateStart, dateEnd) => {
    return Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getMonthWidth = (dateStart, dateEnd) => {
    if (
      dateStart.getMonth() == dateEnd.getMonth() &&
      dateStart.getFullYear() == dateEnd.getFullYear()
    ) {
      return (
        ((isMobile ? 91 : 160) /
          daysInMonth(dateStart.getMonth(), dateStart.getFullYear())) *
        (numOfDays(dateStart, dateEnd) - 1)
      );
    }

    let monthWidth =
      (isMobile ? 91 : 160) * (numOfMonths(dateStart, dateEnd) - 2);
    monthWidth +=
      ((isMobile ? 91 : 160) /
        daysInMonth(dateStart.getMonth(), dateStart.getFullYear())) *
      (daysInMonth(dateStart.getMonth(), dateStart.getFullYear()) -
        dateStart.getDate() +
        1);
    monthWidth +=
      ((isMobile ? 91 : 160) /
        daysInMonth(dateEnd.getMonth(), dateEnd.getFullYear())) *
      dateEnd.getDate();

    return monthWidth;
  };

  const getTaskLeft = () => {
    if (view == "Month") {
      return getMonthLeft(dateStart);
    }
    const numOfDaysFromCalendarStart = Math.floor(
      (dateStart.getTime() - calendarStartDate.getTime()) / 1000 / 60 / 60 / 24
    );
    return isMobile
      ? dayWidthMobile[views.indexOf(view)] * numOfDaysFromCalendarStart
      : dayWidth[views.indexOf(view)] * numOfDaysFromCalendarStart;
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
    return isMobile
      ? dayWidthMobile[views.indexOf(view)] * (taskDuration + 1)
      : dayWidth[views.indexOf(view)] * (taskDuration + 1);
  };

  const getPadding = () => {
    if (taskWidth < 28) {
      if ((taskWidth - 12) / 2 < 3) {
        if ((taskWidth - 4) / 3 < 3) {
          return (taskWidth - 2) / 2;
        }
        return (taskWidth - 4) / 3;
      }
      return (taskWidth - 12) / 2;
    }
    return 8;
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
    document.querySelector("#linesWrapper").style.paddingLeft = "0px";
  }, [dateStart, dateEnd, calendarStartDate]);

  useEvent(window, "resize", () => {
    const newTaskLeft = getTaskLeft();
    const newTaskWidth = getTaskWidth();
    setTaskLeft(newTaskLeft);
    setTaskWidth(newTaskWidth);
    setTextWidth(newTaskWidth - 36);
  });

  useEvent(document, "mousedown", (e) => {
    if (e.target.classList && e.target.classList.contains("stick")) {
      setGlobalCursor("ew-resize");
    }
    if (e.target.classList && e.target.classList.contains("grab")) {
      setGlobalCursor("grab");
    }
  });
  useEvent(document, "mouseup", () => setGlobalCursor(""));

  return (
    <>
      <div
        className={calendarStyles.lineTask}
        style={{
          marginLeft: taskLeft,
          width: taskWidth,
          background: `#${task.color}`,
          paddingLeft: getPadding(),
          paddingRight: getPadding(),
          opacity:
            editedTaskId != "" ? (editedTaskId == task._id ? 1 : 0.5) : 1,
        }}
        ref={lineRef}
        onClick={() => {
          if (isMobile) {
            if (editedTaskId == task._id) {
              setEditedTaskId("");
            } else {
              setEditedTaskId(task._id);
            }
          }
        }}
      >
        <DateTooltip
          isResizeLeft={isResizeLeft}
          isResizeRight={isResizeRight}
          dateStart={dateStart}
          dateEnd={dateEnd}
          taskWidth={taskWidth}
          view={view}
        />

        <SubtaskTooltip task={task} globalCursor={globalCursor} />

        <LeftStick
          task={task}
          isResizeLeft={isResizeLeft}
          setIsResizeLeft={setIsResizeLeft}
          lineRef={lineRef}
          dayWidth={
            isMobile
              ? dayWidthMobile[views.indexOf(view)]
              : dayWidth[views.indexOf(view)]
          }
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          view={view}
          taskWidth={taskWidth}
          globalCursor={globalCursor}
        />

        <CenterArea
          task={task}
          isMoving={isMoving}
          setIsMoving={setIsMoving}
          lineRef={lineRef}
          dayWidth={
            isMobile
              ? dayWidthMobile[views.indexOf(view)]
              : dayWidth[views.indexOf(view)]
          }
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          taskWidth={taskWidth}
          inputRef={inputRef}
          globalCursor={globalCursor}
        >
          <LineTaskName
            task={task}
            textWidth={textWidth}
            taskWidth={taskWidth}
            inputRef={inputRef}
          />
        </CenterArea>

        <RightStick
          task={task}
          isResizeRight={isResizeRight}
          setIsResizeRight={setIsResizeRight}
          lineRef={lineRef}
          dayWidth={
            isMobile
              ? dayWidthMobile[views.indexOf(view)]
              : dayWidth[views.indexOf(view)]
          }
          dateStart={dateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          taskWidth={taskWidth}
          globalCursor={globalCursor}
        />
      </div>

      <When condition={isTaskOpened[task._id]}>
        <LineTasksRoot root={task._id} calendarStartDate={calendarStartDate} />
      </When>
    </>
  );
}

InnerLineTask = memo(InnerLineTask, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.view == nextProps.view &&
    prevProps.calendarStartDate == nextProps.calendarStartDate
  );
});

export default function LineTask(props) {
  const { view } = useContext(OptionsContext);
  const { setEditedTaskId } = useContext(TasksContext);
  return <InnerLineTask {...{ ...props, view, setEditedTaskId }} />;
}
