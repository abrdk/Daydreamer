import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useContext, useRef } from "react";
import useEvent from "@react-hook/event";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";
import DateTooltip from "@/src/components/tasks/Line/LineTask/DateTooltip";
import SubtaskTooltip from "@/src/components/tasks/Line/LineTask/SubtaskTooltip";
import RightStick from "@/src/components/tasks/Line/LineTask/RightStick";
import LeftStick from "@/src/components/tasks/Line/LineTask/LeftStick";
import CenterArea from "@/src/components/tasks/Line/LineTask/CenterArea";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

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
  const extraWidth = [55, 120 / 7, 160 / 30 + 1];
  const dayLeft = [55, 120 / 7, 160 / 30];
  const extraLeft = [0, 0, -1];
  const minOffsetRight = [-70, -5, 0];
  const maxOffsetRight = [15, 5, 0];
  const minOffsetLeft = [70, 5, 0];
  const maxOffsetLeft = [-15, -5, 0];
  const minOffsetMove = [25, 5, 2];
  const maxOffsetMove = [-40, -5, -2];

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

  const getTaskLeft = () => {
    const numOfDaysFromCalendarStart = Math.floor(
      (dateStart.getTime() - calendarStartDate.getTime()) / 1000 / 60 / 60 / 24
    );
    return (
      dayLeft[views.indexOf(view)] * numOfDaysFromCalendarStart +
      extraLeft[views.indexOf(view)]
    );
  };

  const getTaskWidth = () => {
    const taskDuration = Math.floor(
      (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
    );
    return (
      dayWidth[views.indexOf(view)] * taskDuration +
      extraWidth[views.indexOf(view)]
    );
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

  // const line = useRef(null);
  // const { projectByQueryId } = useContext(ProjectsContext);
  // const userCtx = useContext(UsersContext);createSubtask

  // const [temporaryDateEnd, setTemporaryDateEnd] = useState(new Date());
  // const [temporaryDateStart, setTemporaryDateStart] = useState(new Date());

  // const daysInMonth = (month, year) => {
  //   return new Date(year, month + 1, 0).getDate();
  // };

  // const getMonthLeft = (dateStart) => {
  //   let monthLeft = 0;
  //   [...Array(dateStart.getMonth() + 1).keys()].forEach((m) => {
  //     if (m == dateStart.getMonth()) {
  //       monthLeft +=
  //         (160 / daysInMonth(m, dateStart.getFullYear())) *
  //         (dateStart.getDate() - 1);
  //     } else {
  //       monthLeft += 160;
  //     }
  //   });
  //   return monthLeft;
  // };

  // const numOfDays = (dateStart, dateEnd) => {
  //   return Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24)) + 1;
  // };

  // const getMonthWidth = (dateStart, dateEnd) => {
  //   const range = (start, stop, step = 1) =>
  //     Array(Math.ceil((stop - start) / step))
  //       .fill(start)
  //       .map((x, y) => x + y * step);

  //   let monthWidth = 0;
  //   range(dateStart.getMonth(), dateEnd.getMonth() + 1).forEach((m) => {
  //     if (m == dateStart.getMonth() && m == dateEnd.getMonth()) {
  //       monthWidth +=
  //         (160 / daysInMonth(m, dateStart.getFullYear())) *
  //         (numOfDays(dateStart, dateEnd) - 1);
  //     } else if (m == dateStart.getMonth()) {
  //       monthWidth +=
  //         (160 / daysInMonth(m, dateStart.getFullYear())) *
  //         (daysInMonth(m, dateStart.getFullYear()) - dateStart.getDate() + 1);
  //     } else if (m == dateEnd.getMonth()) {
  //       monthWidth +=
  //         (160 / daysInMonth(m, dateEnd.getFullYear())) * dateEnd.getDate();
  //     } else {
  //       monthWidth += 160;
  //     }
  //   });
  //   return monthWidth;
  // };

  // const minWidth = [55, 120 / 7, 160 / 31];
  // const minOffsetLeft = [70, 5, 0];
  // const maxOffsetLeft = [-15, -5, 0];
  // const minOffsetRight = [-70, -5, 0];
  // const maxOffsetRight = [15, 5, 0];
  // const minOffsetMove = [25, 5, 2];
  // const maxOffsetMove = [-40, -5, -2];
  // const minTextWidth = [6, -2, -2];

  // const {
  //   updateTask,
  //   tasksByProjectId,
  //   createTask,
  //   updateIsOpened,
  // } = useContext(TasksContext);
  // const subtasks = tasksByProjectId.filter((t) => t.root == task._id);

  // const [isResizeRight, setResizeRight] = useState(false);
  // const [isResizeLeft, setResizeLeft] = useState(false);
  // const [isMove, setMove] = useState(false);
  // const [scrollingSpeed, setScrollingSpeed] = useState(0);
  // const [scrollingTimer, setScrollingTimer] = useState(null);
  // const [mouseX, setMouseX] = useState(0);
  // const [offsetFromCenter, setOffsetFromCenter] = useState(0);
  // const [textWidth, setTextWidth] = useState(0);

  // const today = new Date();
  // let startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  // if (view == "Week") {
  //   startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  //   startOfYear.setDate(1 - startOfYear.getDay() + 1);
  // }
  // if (calendarStartDate) {
  //   startOfYear = calendarStartDate;
  // }

  // if (view == "Month") {
  //   taskLeft = getMonthLeft(temporaryDateStart);
  //   taskWidth = getMonthWidth(temporaryDateStart, temporaryDateEnd);
  // }

  // let moveAreaCenterWidth;
  // if (taskWidth >= 136) {
  //   moveAreaCenterWidth = 100;
  // } else {
  //   moveAreaCenterWidth = taskWidth - 36;
  // }

  // const stopMove = () => {
  //   if (view == "Month") {
  //     line.current.style.width = getMonthWidth(
  //       temporaryDateStart,
  //       temporaryDateEnd
  //     );
  //   }
  //   updateTask({
  //     ...task,
  //     dateStart: temporaryDateStart,
  //     dateEnd: temporaryDateEnd,
  //   });
  //   document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  //   document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
  // };

  // const stopResizeRight = () => {
  //   updateTask({ ...task, dateEnd: temporaryDateEnd });
  //   document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  //   document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
  // };

  // const stopResizeLeft = () => {
  //   updateTask({ ...task, dateStart: temporaryDateStart });
  //   document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  //   document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
  // };

  // useEvent(document, "mouseup", (e) => {
  //   if (isResizeLeft) {
  //     stopResizeLeft();
  //   }
  //   if (isResizeRight) {
  //     stopResizeRight();
  //   }
  //   if (isMove) {
  //     stopMove();
  //   }
  //   setResizeLeft(false);
  //   setResizeRight(false);
  //   setMove(false);
  //   setOffsetFromCenter(0);
  //   document.body.style.cursor = "default";
  //   clearInterval(scrollingTimer);
  //   setScrollingTimer(null);
  //   setScrollingSpeed(0);
  // });

  // const resizeLeftHandler = (e) => {
  //   const offset = mouseX - line.current.getBoundingClientRect().left;
  //   let currentWidth = width[views.indexOf(view)];
  //   if (
  //     Number(line.current.style.width.slice(0, -2)) - offset <=
  //     minWidth[views.indexOf(view)]
  //   ) {
  //     line.current.style.width = minWidth[views.indexOf(view)] + "px";
  //     setTextWidth(minTextWidth[views.indexOf(view)]);
  //     line.current.style.left =
  //       taskLeft + taskWidth - minWidth[views.indexOf(view)] + "px";
  //     setTemporaryDateStart(dateEnd);
  //   } else if (
  //     offset <= maxOffsetLeft[views.indexOf(view)] ||
  //     offset >= minOffsetLeft[views.indexOf(view)]
  //   ) {
  //     if (view == "Month") {
  //       const newDateStart = new Date(
  //         temporaryDateStart.getFullYear(),
  //         temporaryDateStart.getMonth(),
  //         temporaryDateStart.getDate() + Math.floor(offset / currentWidth)
  //       );
  //       const newLineLeft = getMonthLeft(newDateStart);
  //       if (newLineLeft >= -1) {
  //         const newLineWidth = getMonthWidth(newDateStart, temporaryDateEnd);
  //         setTextWidth(newLineWidth - 36);
  //         setTemporaryDateStart(newDateStart);
  //       }
  //       const newLineWidth =
  //         Number(line.current.style.width.slice(0, -2)) -
  //         Math.floor(offset / currentWidth) * currentWidth;
  //       line.current.style.width = newLineWidth + "px";
  //     } else {
  //       const newLineLeft =
  //         Number(line.current.style.left.slice(0, -2)) +
  //         Math.floor(offset / currentWidth) * currentWidth;
  //       if (newLineLeft >= -1) {
  //         line.current.style.left = newLineLeft + "px";

  //         const newLineWidth =
  //           Number(line.current.style.width.slice(0, -2)) -
  //           Math.floor(offset / currentWidth) * currentWidth;
  //         line.current.style.width = newLineWidth + "px";

  //         setTextWidth(newLineWidth - 36);
  //         setTemporaryDateStart(
  //           new Date(
  //             temporaryDateStart.getFullYear(),
  //             temporaryDateStart.getMonth(),
  //             temporaryDateStart.getDate() + Math.floor(offset / currentWidth)
  //           )
  //         );
  //       }
  //     }
  //   }
  // };

  // const resizeRightHandler = (e) => {
  //   const offset = mouseX - line.current.getBoundingClientRect().right;
  //   let currentWidth = width[views.indexOf(view)];
  //   if (view == "Month") {
  //     currentWidth =
  //       160 /
  //       daysInMonth(
  //         temporaryDateEnd.getMonth(),
  //         temporaryDateEnd.getFullYear()
  //       );
  //   }
  //   if (
  //     Number(line.current.style.width.slice(0, -2)) + offset <=
  //     minWidth[views.indexOf(view)]
  //   ) {
  //     setTextWidth(minTextWidth[views.indexOf(view)]);
  //     line.current.style.width = minWidth[views.indexOf(view)] + "px";
  //     setTemporaryDateEnd(dateStart);
  //   } else if (
  //     offset >= maxOffsetRight[views.indexOf(view)] ||
  //     offset <= minOffsetRight[views.indexOf(view)]
  //   ) {
  //     const newLineWidth =
  //       Number(line.current.style.width.slice(0, -2)) +
  //       (Math.floor(offset / currentWidth) + 1) * currentWidth;
  //     line.current.style.width = newLineWidth + "px";
  //     setTextWidth(newLineWidth - 36);
  //     setTemporaryDateEnd(
  //       new Date(
  //         temporaryDateEnd.getFullYear(),
  //         temporaryDateEnd.getMonth(),
  //         temporaryDateEnd.getDate() + (Math.floor(offset / currentWidth) + 1),
  //         23,
  //         59,
  //         59
  //       )
  //     );
  //   }
  // };

  // const moveHandler = (e) => {
  //   const offset =
  //     mouseX -
  //     (line.current.getBoundingClientRect().right -
  //       line.current.getBoundingClientRect().width / 2) +
  //     offsetFromCenter;

  //   let currentLeft = width[views.indexOf(view)];
  //   if (view == "Month") {
  //     currentLeft =
  //       160 /
  //       daysInMonth(
  //         temporaryDateStart.getMonth(),
  //         temporaryDateStart.getFullYear()
  //       );
  //   }
  //   if (
  //     offset >= minOffsetMove[views.indexOf(view)] ||
  //     offset <= maxOffsetMove[views.indexOf(view)]
  //   ) {
  //     const newLeft =
  //       Number(line.current.style.left.slice(0, -2)) +
  //       Math.floor(offset / currentLeft) * currentLeft;
  //     line.current.style.left = newLeft + "px";
  //     setTemporaryDateStart(
  //       new Date(
  //         temporaryDateStart.getFullYear(),
  //         temporaryDateStart.getMonth(),
  //         temporaryDateStart.getDate() + Math.floor(offset / currentLeft),
  //         0,
  //         0,
  //         0
  //       )
  //     );
  //     setTemporaryDateEnd(
  //       new Date(
  //         temporaryDateEnd.getFullYear(),
  //         temporaryDateEnd.getMonth(),
  //         temporaryDateEnd.getDate() + Math.floor(offset / currentLeft),
  //         23,
  //         59,
  //         59
  //       )
  //     );
  //   }
  // };

  // const addScroll = (e) => {
  //   let minX;
  //   if (document.querySelector("#openedMenu")) {
  //     minX = document.querySelector("#openedMenu").clientWidth + 100;
  //   } else {
  //     minX = 100;
  //   }

  //   if (mouseX < minX) {
  //     if (scrollingSpeed >= 0) {
  //       clearInterval(scrollingTimer);
  //       setScrollingTimer(null);
  //       setScrollingSpeed(-4);
  //     }
  //   } else if (mouseX > window.innerWidth - 100) {
  //     if (scrollingSpeed <= 0) {
  //       clearInterval(scrollingTimer);
  //       setScrollingTimer(null);
  //       setScrollingSpeed(4);
  //     }
  //   } else {
  //     clearInterval(scrollingTimer);
  //     setScrollingTimer(null);
  //     setScrollingSpeed(0);
  //   }
  // };

  // useEvent(document, "mousemove", (e) => {
  //   if (isResizeLeft || isResizeRight || isMove) {
  //     setMouseX(e.clientX);
  //     addScroll(e);
  //     if (isResizeRight) {
  //       resizeRightHandler(e);
  //     }
  //     if (isMove) {
  //       moveHandler(e);
  //     }
  //   }
  // });

  // useEvent(document.querySelector(".Calendar-Scroller"), "scroll", (e) => {
  //   if (isResizeLeft || isResizeRight || isMove) {
  //     if (isResizeLeft) {
  //       resizeLeftHandler(e);
  //     }
  //     if (isResizeRight) {
  //       resizeRightHandler(e);
  //     }
  //     if (isMove) {
  //       moveHandler(e);
  //     }
  //   }
  // });

  // useEffect(() => {
  //   if (scrollingSpeed) {
  //     setScrollingTimer(
  //       setInterval(() => {
  //         document
  //           .querySelector(".Calendar-Scroller")
  //           .scrollBy(scrollingSpeed, 0);
  //       }, 10)
  //     );
  //   }
  // }, [scrollingSpeed]);

  // useEffect(() => {
  //   if (line.current) {
  //     setTextWidth(Number(line.current.style.width.slice(0, -2)) - 36);
  //   }
  // }, [line.current]);

  // useEffect(() => {
  //   if (line.current) {
  //     setTextWidth(taskWidth - 36);
  //   }
  // }, [taskWidth]);

  return (
    <>
      <div
        className={calendarStyles.lineTask}
        style={{
          left: taskLeft,
          width: taskWidth,
          background: `#${task.color}`,
          top: taskTop,
          paddingLeft: taskWidth > 120 / 7 ? 8 : 120 / 7 / 2 - 1,
          paddingRight: taskWidth > 120 / 7 ? 8 : 120 / 7 / 2 - 1,
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
