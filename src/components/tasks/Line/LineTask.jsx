import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useContext, useRef } from "react";
import useEvent from "@react-hook/event";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";
const dateFormat = require("dateformat");

import LineTasksRoot from "@/src/components/tasks/Line/LineTasksRoot";

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
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [temporaryDateEnd, setTemporaryDateEnd] = useState(new Date());
  const [temporaryDateStart, setTemporaryDateStart] = useState(new Date());

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthLeft = () => {
    let monthLeft = 0;
    [...Array(temporaryDateStart.getMonth() + 1).keys()].forEach((m) => {
      if (m == temporaryDateStart.getMonth()) {
        monthLeft +=
          (160 / daysInMonth(m, temporaryDateStart.getFullYear())) *
          (temporaryDateStart.getDate() - 1);
      } else {
        monthLeft += 160;
      }
    });
    return monthLeft;
  };
  const getMonthWidth = () => {
    const range = (start, stop, step = 1) =>
      Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);

    let monthWidth = 0;
    range(
      temporaryDateStart.getMonth(),
      temporaryDateEnd.getMonth() + 1
    ).forEach((m) => {
      if (m == temporaryDateStart.getMonth()) {
        monthWidth +=
          (160 / daysInMonth(m, temporaryDateStart.getFullYear())) *
          (daysInMonth(m, temporaryDateStart.getFullYear()) -
            temporaryDateStart.getDate() +
            1);
      } else if (m == temporaryDateEnd.getMonth()) {
        monthWidth +=
          (160 / daysInMonth(m, temporaryDateEnd.getFullYear())) *
          temporaryDateEnd.getDate();
      } else {
        monthWidth += 160;
      }
    });
    return monthWidth;
  };

  const views = ["Day", "Week", "Month"];
  const width = [55, 120 / 7, 160 / 30];
  const minWidth = [55, 120 / 7, 160 / 31];
  const extraWidth = [56, 120 / 7 + 1, 160 / 30 + 1];
  const left = [55, 120 / 7, 160 / 30];
  const extraLeft = [-1, -1, -1];
  const minOffsetLeft = [70, 5, 0];
  const maxOffsetLeft = [-15, -5, 0];
  const minOffsetRight = [-70, -5, 0];
  const maxOffsetRight = [15, 5, 0];
  const minOffsetMove = [25, 5, 2];
  const maxOffsetMove = [-40, -5, -2];
  const minTextWidth = [6, -2, -2];

  const {
    updateTask,
    tasksByProjectId,
    createTask,
    updateIsOpened,
  } = useContext(TasksContext);
  const subtasks = tasksByProjectId.filter((t) => t.root == task._id);

  const line = useRef(null);
  const [isResizeRight, setResizeRight] = useState(false);
  const [isResizeLeft, setResizeLeft] = useState(false);
  const [isMove, setMove] = useState(false);
  const [scrollingSpeed, setScrollingSpeed] = useState(0);
  const [scrollingTimer, setScrollingTimer] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [offsetFromCenter, setOffsetFromCenter] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const today = new Date();
  let startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  if (view == "Week") {
    startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
    startOfYear.setDate(1 - startOfYear.getDay() + 1);
  }
  const numOfDaysFromStart = Math.floor(
    (dateStart.getTime() - calendarStartDate.getTime()) / 1000 / 60 / 60 / 24
  );
  const taskDuration = Math.floor(
    (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
  );

  let taskWidth =
    width[views.indexOf(view)] * taskDuration + extraWidth[views.indexOf(view)];

  let taskLeft =
    left[views.indexOf(view)] * numOfDaysFromStart +
    extraLeft[views.indexOf(view)];
  if (view == "Month") {
    taskLeft = getMonthLeft();
    taskWidth = getMonthWidth();
  }
  const taskTop = 20 + index * 55;
  let moveAreaCenterWidth;
  if (taskWidth >= 136) {
    moveAreaCenterWidth = 100;
  } else {
    moveAreaCenterWidth = taskWidth - 36;
  }

  const createSubtask = async () => {
    let order;
    if (subtasks.length) {
      order = subtasks[subtasks.length - 1].order + 1;
    } else {
      order = 0;
    }
    const newSubtaskId = nanoid();
    updateIsOpened({ _id: task._id, isOpened: true });
    setMenu(true);
    await createTask({
      ...task,
      _id: newSubtaskId,
      name: "",
      description: "",
      root: task._id,
      order,
      color: "258EFA",
    });
    setEditedTask(newSubtaskId);
  };

  const stopMove = () => {
    line.current.style.width = getMonthWidth();
    updateTask({
      ...task,
      dateStart: temporaryDateStart,
      dateEnd: temporaryDateEnd,
    });
  };

  const stopResizeRight = () => {
    updateTask({ ...task, dateEnd: temporaryDateEnd });
  };

  const stopResizeLeft = () => {
    updateTask({ ...task, dateStart: temporaryDateStart });
  };

  useEvent(document, "mouseup", (e) => {
    if (isResizeLeft) {
      stopResizeLeft();
    }
    if (isResizeRight) {
      stopResizeRight();
    }
    if (isMove) {
      stopMove();
    }
    setResizeLeft(false);
    setResizeRight(false);
    setMove(false);
    setOffsetFromCenter(0);
    document.body.style.cursor = "default";
    clearInterval(scrollingTimer);
    setScrollingTimer(null);
    setScrollingSpeed(0);
  });

  const resizeLeftHandler = (e) => {
    const offset = mouseX - line.current.getBoundingClientRect().left;
    let currentWidth = width[views.indexOf(view)];
    if (view == "Month") {
      currentWidth =
        160 /
        daysInMonth(
          temporaryDateStart.getMonth(),
          temporaryDateStart.getFullYear()
        );
    }
    if (
      Number(line.current.style.width.slice(0, -2)) - offset <=
      minWidth[views.indexOf(view)]
    ) {
      line.current.style.width = minWidth[views.indexOf(view)] + "px";
      setTextWidth(minTextWidth[views.indexOf(view)]);
      line.current.style.left =
        taskLeft + taskWidth - minWidth[views.indexOf(view)] + "px";
      setTemporaryDateStart(dateEnd);
    } else if (
      offset <= maxOffsetLeft[views.indexOf(view)] ||
      offset >= minOffsetLeft[views.indexOf(view)]
    ) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / currentWidth) * currentWidth +
        "px";
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) -
        Math.floor(offset / currentWidth) * currentWidth;
      line.current.style.width = newLineWidth + "px";
      setTextWidth(newLineWidth - 36);
      setTemporaryDateStart(
        new Date(
          temporaryDateStart.getFullYear(),
          temporaryDateStart.getMonth(),
          temporaryDateStart.getDate() + Math.floor(offset / currentWidth),
          0,
          0,
          0
        )
      );
    }
  };

  const resizeRightHandler = (e) => {
    const offset = mouseX - line.current.getBoundingClientRect().right;
    let currentWidth = width[views.indexOf(view)];
    if (view == "Month") {
      currentWidth =
        160 /
        daysInMonth(
          temporaryDateEnd.getMonth(),
          temporaryDateEnd.getFullYear()
        );
    }
    if (
      Number(line.current.style.width.slice(0, -2)) + offset <=
      minWidth[views.indexOf(view)]
    ) {
      setTextWidth(minTextWidth[views.indexOf(view)]);
      line.current.style.width = minWidth[views.indexOf(view)] + "px";
      setTemporaryDateEnd(dateStart);
    } else if (
      offset >= maxOffsetRight[views.indexOf(view)] ||
      offset <= minOffsetRight[views.indexOf(view)]
    ) {
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) +
        (Math.floor(offset / currentWidth) + 1) * currentWidth;
      line.current.style.width = newLineWidth + "px";
      setTextWidth(newLineWidth - 36);
      setTemporaryDateEnd(
        new Date(
          temporaryDateEnd.getFullYear(),
          temporaryDateEnd.getMonth(),
          temporaryDateEnd.getDate() + (Math.floor(offset / currentWidth) + 1),
          23,
          59,
          59
        )
      );
    }
  };

  const moveHandler = (e) => {
    const offset =
      mouseX -
      (line.current.getBoundingClientRect().right -
        line.current.getBoundingClientRect().width / 2) +
      offsetFromCenter;

    let currentLeft = width[views.indexOf(view)];
    if (view == "Month") {
      currentLeft =
        160 /
        daysInMonth(
          temporaryDateStart.getMonth(),
          temporaryDateStart.getFullYear()
        );
    }
    if (
      offset >= minOffsetMove[views.indexOf(view)] ||
      offset <= maxOffsetMove[views.indexOf(view)]
    ) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / currentLeft) * currentLeft +
        "px";
      setTemporaryDateStart(
        new Date(
          temporaryDateStart.getFullYear(),
          temporaryDateStart.getMonth(),
          temporaryDateStart.getDate() + Math.floor(offset / currentLeft),
          0,
          0,
          0
        )
      );
      setTemporaryDateEnd(
        new Date(
          temporaryDateEnd.getFullYear(),
          temporaryDateEnd.getMonth(),
          temporaryDateEnd.getDate() + Math.floor(offset / currentLeft),
          23,
          59,
          59
        )
      );
    }
  };

  const addScroll = (e) => {
    let minX;
    if (document.querySelector("#openedMenu")) {
      minX = document.querySelector("#openedMenu").clientWidth + 100;
    } else {
      minX = 100;
    }

    if (mouseX < minX) {
      if (scrollingSpeed >= 0) {
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(-4);
      }
    } else if (mouseX > window.innerWidth - 100) {
      if (scrollingSpeed <= 0) {
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(4);
      }
    } else {
      clearInterval(scrollingTimer);
      setScrollingTimer(null);
      setScrollingSpeed(0);
    }
  };

  useEvent(document, "mousemove", (e) => {
    if (isResizeLeft || isResizeRight || isMove) {
      setMouseX(e.clientX);
      addScroll(e);
      if (isResizeLeft) {
        resizeLeftHandler(e);
      }
      if (isResizeRight) {
        resizeRightHandler(e);
      }
      if (isMove) {
        moveHandler(e);
      }
    }
  });

  useEvent(document.querySelector(".Calendar-Scroller"), "scroll", (e) => {
    if (isResizeLeft || isResizeRight || isMove) {
      if (isResizeLeft) {
        resizeLeftHandler(e);
      }
      if (isResizeRight) {
        resizeRightHandler(e);
      }
      if (isMove) {
        moveHandler(e);
      }
    }
  });

  useEvent(document, "mousemove", (e) => {
    if (isResizeLeft || isResizeRight || isMove) {
      e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
    }
  });

  useEffect(() => {
    if (scrollingSpeed) {
      setScrollingTimer(
        setInterval(() => {
          document
            .querySelector(".Calendar-Scroller")
            .scrollBy(scrollingSpeed, 0);
        }, 10)
      );
    }
  }, [scrollingSpeed]);

  useEffect(() => {
    if (task) {
      if (typeof task.dateStart == "string") {
        setDateStart(new Date(task.dateStart));
        setTemporaryDateStart(new Date(task.dateStart));
      } else {
        setDateStart(task.dateStart);
        setTemporaryDateStart(task.dateStart);
      }
      if (typeof task.dateEnd == "string") {
        setDateEnd(new Date(task.dateEnd));
        setTemporaryDateEnd(new Date(task.dateEnd));
      } else {
        setDateEnd(task.dateEnd);
        setTemporaryDateEnd(task.dateEnd);
      }
    }
  }, [task]);

  useEffect(() => {
    if (line.current) {
      setTextWidth(Number(line.current.style.width.slice(0, -2)) - 36);
    }
  }, [line.current]);

  useEffect(() => {
    if (line.current) {
      setTextWidth(taskWidth - 36);
    }
  }, [taskWidth]);

  return (
    <>
      <div
        className={calendarStyles.lineTask}
        style={{
          left: taskLeft,
          width: taskWidth,
          background: `#${task.color}`,
          top: taskTop,
          paddingLeft: textWidth > -2 ? "8px" : "7px",
        }}
        ref={line}
      >
        <When condition={isResizeRight && view != "Day"}>
          <div
            className={calendarStyles.tooltip}
            style={{
              left: line.current
                ? Number(line.current.style.width.slice(0, -2)) - 50
                : taskWidth - 50,
            }}
          >
            {dateFormat(temporaryDateEnd, "dd-mm-yyyy")}
            <div className={calendarStyles.triangle}></div>
          </div>
        </When>
        <When condition={isResizeLeft && view != "Day"}>
          <div
            className={calendarStyles.tooltip}
            style={{
              left: -30,
            }}
          >
            {dateFormat(temporaryDateStart, "dd-mm-yyyy")}
            <div className={calendarStyles.triangle}></div>
          </div>
        </When>
        <When condition={subtasks.length}>
          <div className={calendarStyles.openSubtasksWrapper}>
            <div
              className={calendarStyles.openSubtasksIcon}
              onClick={() =>
                updateIsOpened({ _id: task._id, isOpened: !task.isOpened })
              }
            >
              <img src="/img/arrowDownLine.svg" alt=" " />
            </div>
          </div>
        </When>
        <When condition={projectByQueryId.owner == userCtx._id}>
          <div className={calendarStyles.addSubtaskWrapper}>
            <div
              className={calendarStyles.addSubtaskIcon}
              onClick={() => createSubtask()}
            >
              <img src="/img/plusLine.svg" alt=" " />
            </div>
          </div>
        </When>
        <When
          condition={textWidth > -5 && projectByQueryId.owner == userCtx._id}
        >
          <div
            className={calendarStyles.resizeAreaLeft}
            onMouseDown={(e) => {
              setMouseX(e.clientX);
              setResizeLeft(true);
              document.body.style.cursor = "grab";
            }}
            style={{
              cursor: isResizeLeft ? "grab" : "pointer",
            }}
          ></div>
        </When>
        <When condition={textWidth > -5}>
          <div className={calendarStyles.stick}></div>
        </When>
        <When
          condition={textWidth > 0 && projectByQueryId.owner == userCtx._id}
        >
          <div
            className={calendarStyles.moveAreaCenter}
            style={{
              width: moveAreaCenterWidth,
              left: (taskWidth - moveAreaCenterWidth) / 2,
              cursor: isMove ? "grab" : "pointer",
            }}
            onMouseDown={(e) => {
              setMouseX(e.clientX);
              setMove(true);
              document.body.style.cursor = "grab";
              const rect = line.current.getBoundingClientRect();
              setOffsetFromCenter(rect.left + rect.width / 2 - e.clientX);
            }}
          ></div>
        </When>
        <When condition={textWidth > 0}>
          <Truncate lines={1} width={textWidth}>
            {task.name}
          </Truncate>
        </When>
        <div className={calendarStyles.stick}></div>
        <When condition={projectByQueryId.owner == userCtx._id}>
          <div
            className={calendarStyles.resizeAreaRight}
            onMouseDown={(e) => {
              setResizeRight(true);
              document.body.style.cursor = "grab";
              setMouseX(e.clientX);
            }}
            style={{
              cursor: isResizeRight ? "grab" : "pointer",
            }}
          ></div>
        </When>
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
