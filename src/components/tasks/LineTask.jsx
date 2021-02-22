import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext, useRef } from "react";
import useEvent from "@react-hook/event";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";

import LineTasksRoot from "@/src/components/tasks/LineTasksRoot";

import { TasksContext } from "@/src//context/tasks/TasksContext";

const views = ["Day", "Week", "Month"];
const width = [55, 120 / 7];
const minWidth = [42, 120 / 7];
const extraWidth = [42, 120 / 7];
const left = [55, 17.142];
const extraLeft = [6.5, 0];
const minOffsetLeft = [60, 5];
const maxOffsetLeft = [-25, -5];
const minOffsetRight = [-60, -5];
const maxOffsetRight = [25, 5];
const minOffsetMove = [25, 5];
const maxOffsetMove = [-40, -5];
const minTextWidth = [6, -2];

export default function LineTask({
  task,
  index,
  setMenu,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
  view,
}) {
  const { updateTask, tasksByProjectId, createTask } = useContext(TasksContext);
  const subtasks = tasksByProjectId.filter((t) => t.root == task._id);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [isResizeRight, setResizeRight] = useState(false);
  const [isResizeLeft, setResizeLeft] = useState(false);
  const [isMove, setMove] = useState(false);
  const line = useRef(null);
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
    (dateStart.getTime() - startOfYear.getTime()) / 1000 / 60 / 60 / 24
  );
  const taskDuration = Math.floor(
    (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
  );

  const taskWidth =
    width[views.indexOf(view)] * taskDuration + extraWidth[views.indexOf(view)];

  const taskLeft =
    left[views.indexOf(view)] * numOfDaysFromStart +
    extraLeft[views.indexOf(view)];

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
    setIsSubtasksOpened(
      isSubtasksOpened.map((bool, i) => {
        if (i == index) {
          return true;
        }
        return bool;
      })
    );
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
    let newDateStart = new Date(
      dateStart.getFullYear(),
      dateStart.getMonth(),
      1,
      0,
      0,
      0
    );
    let newDateEnd = new Date(
      dateEnd.getFullYear(),
      dateEnd.getMonth(),
      1,
      23,
      59,
      59
    );

    const distance = taskLeft - Number(line.current.style.left.slice(0, -2));

    newDateStart.setDate(
      dateStart.getDate() -
        Math.floor((distance + 1) / width[views.indexOf(view)])
    );
    newDateEnd.setDate(
      dateEnd.getDate() -
        Math.floor((distance + 1) / width[views.indexOf(view)])
    );
    setDateStart(newDateStart);
    setDateEnd(newDateEnd);
    updateTask({ ...task, dateStart: newDateStart, dateEnd: newDateEnd });
  };

  const stopResizeRight = () => {
    let date = new Date(
      dateEnd.getFullYear(),
      dateEnd.getMonth(),
      1,
      23,
      59,
      59
    );
    const distance = taskWidth - Number(line.current.style.width.slice(0, -2));

    date.setDate(
      dateEnd.getDate() -
        Math.floor((distance + 1) / width[views.indexOf(view)])
    );
    setDateEnd(date);
    updateTask({ ...task, dateEnd: date });
  };

  const stopResizeLeft = () => {
    let date = new Date(
      dateStart.getFullYear(),
      dateStart.getMonth(),
      1,
      0,
      0,
      0
    );
    const distance = Number(line.current.style.left.slice(0, -2)) - taskLeft;

    date.setDate(
      dateStart.getDate() +
        Math.floor((distance + 1) / width[views.indexOf(view)])
    );
    setDateStart(date);
    updateTask({ ...task, dateStart: date });
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
    if (
      Number(line.current.style.width.slice(0, -2)) - offset <=
      minWidth[views.indexOf(view)]
    ) {
      line.current.style.width = minWidth[views.indexOf(view)] + "px";
      setTextWidth(minTextWidth[views.indexOf(view)]);
      line.current.style.left =
        taskLeft + taskWidth - minWidth[views.indexOf(view)] + "px";
    } else if (
      offset <= maxOffsetLeft[views.indexOf(view)] ||
      offset >= minOffsetLeft[views.indexOf(view)]
    ) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / width[views.indexOf(view)]) *
          width[views.indexOf(view)] +
        "px";
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) -
        Math.floor(offset / width[views.indexOf(view)]) *
          width[views.indexOf(view)];
      line.current.style.width = newLineWidth + "px";
      setTextWidth(newLineWidth - 36);
    }
  };

  const resizeRightHandler = (e) => {
    const offset = mouseX - line.current.getBoundingClientRect().right;

    if (
      Number(line.current.style.width.slice(0, -2)) + offset <=
      minWidth[views.indexOf(view)]
    ) {
      setTextWidth(minTextWidth[views.indexOf(view)]);
      line.current.style.width = minWidth[views.indexOf(view)] + "px";
    } else if (
      offset >= maxOffsetRight[views.indexOf(view)] ||
      offset <= minOffsetRight[views.indexOf(view)]
    ) {
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) +
        (Math.floor(offset / width[views.indexOf(view)]) + 1) *
          width[views.indexOf(view)];
      line.current.style.width = newLineWidth + "px";
      setTextWidth(newLineWidth - 36);
    }
  };

  const moveHandler = (e) => {
    const offset =
      mouseX -
      (line.current.getBoundingClientRect().right -
        line.current.getBoundingClientRect().width / 2) +
      offsetFromCenter;
    if (
      offset >= minOffsetMove[views.indexOf(view)] ||
      offset <= maxOffsetMove[views.indexOf(view)]
    ) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / width[views.indexOf(view)]) *
          width[views.indexOf(view)] +
        "px";
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
        className={styles.lineTask}
        style={{
          left: taskLeft,
          width: taskWidth,
          background: `#${task.color}`,
          top: taskTop,
          paddingLeft: textWidth > -2 ? "8px" : "7px",
        }}
        ref={line}
      >
        <When condition={subtasks.length}>
          <div className={styles.openSubtasksWrapper}>
            <div
              className={styles.openSubtasksIcon}
              onClick={() => {
                setIsSubtasksOpened(
                  isSubtasksOpened.map((bool, i) => {
                    if (i == index) {
                      return !bool;
                    }
                    return bool;
                  })
                );
              }}
            >
              <img src="/img/arrowDownLine.svg" alt=" " />
            </div>
          </div>
        </When>
        <div className={styles.addSubtaskWrapper}>
          <div
            className={styles.addSubtaskIcon}
            onClick={() => createSubtask()}
          >
            <img src="/img/plusLine.svg" alt=" " />
          </div>
        </div>
        <When condition={textWidth > -5}>
          <div
            className={styles.resizeAreaLeft}
            onMouseDown={(e) => {
              setMouseX(e.clientX);
              setResizeLeft(true);
              document.body.style.cursor = "grab";
            }}
            style={{
              cursor: isResizeLeft ? "grab" : "pointer",
            }}
          ></div>
          <div className={styles.stick}></div>
        </When>
        <When condition={textWidth > 0}>
          <div
            className={styles.moveAreaCenter}
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
          <Truncate lines={1} width={textWidth}>
            {task.name}
          </Truncate>
        </When>
        <div className={styles.stick}></div>
        <div
          className={styles.resizeAreaRight}
          onMouseDown={(e) => {
            setResizeRight(true);
            document.body.style.cursor = "grab";
            setMouseX(e.clientX);
          }}
          style={{
            cursor: isResizeRight ? "grab" : "pointer",
          }}
        ></div>
      </div>
      <When condition={isSubtasksOpened[index]}>
        <LineTasksRoot
          root={task._id}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          setMenu={setMenu}
          isSubtasksOpened={isSubtasksOpened}
          setIsSubtasksOpened={setIsSubtasksOpened}
          view={view}
        />
      </When>
    </>
  );
}
