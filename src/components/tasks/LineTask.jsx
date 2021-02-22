import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext, useRef } from "react";
import useEvent from "@react-hook/event";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";

import LineTasksRoot from "@/src/components/tasks/LineTasksRoot";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTask({
  task,
  index,
  setMenu,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
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
  const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  const numOfDaysFrom1January = useMemo(
    () =>
      Math.floor(
        (dateStart.getTime() - startOfYear.getTime()) / 1000 / 60 / 60 / 24
      ),
    [dateStart]
  );
  const taskDuration = useMemo(
    () =>
      Math.floor(
        (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60 / 24
      ),
    [dateEnd, dateStart]
  );

  const taskWidth = 55 * taskDuration + 42;
  const taskLeft = 55 * numOfDaysFrom1January + 6.5;
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
    if (distance <= -55 || distance >= 0) {
      newDateStart.setDate(dateStart.getDate() - Math.floor(distance / 55));
      newDateEnd.setDate(dateEnd.getDate() - Math.floor(distance / 55));

      setDateStart(newDateStart);
      setDateEnd(newDateEnd);
      updateTask({ ...task, dateStart: newDateStart, dateEnd: newDateEnd });
    } else {
      line.current.style.left = taskLeft + "px";
    }
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

    if (distance <= 0 || distance >= 55) {
      date.setDate(dateEnd.getDate() - Math.floor(distance / 55));
      setDateEnd(date);
      updateTask({ ...task, dateEnd: date });
    } else {
      line.current.style.width = taskWidth + "px";
    }
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

    if (distance <= 0 || distance >= 55) {
      date.setDate(dateStart.getDate() + Math.floor(distance / 55));
      setDateStart(date);
      updateTask({ ...task, dateStart: date });
    } else {
      line.current.style.left = taskLeft + "px";
      line.current.style.width = taskWidth + "px";
    }
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
    if (Number(line.current.style.width.slice(0, -2)) - offset <= 42) {
      line.current.style.width = "42px";
      setTextWidth(6);
      line.current.style.left = taskLeft + taskWidth - 42 + "px";
    } else if (offset <= -25 || offset >= 60) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / 55) * 55 +
        "px";
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) -
        Math.floor(offset / 55) * 55;
      line.current.style.width = newLineWidth + "px";
      setTextWidth(newLineWidth - 36);
    }
  };

  const resizeRightHandler = (e) => {
    const offset = mouseX - line.current.getBoundingClientRect().right;

    if (Number(line.current.style.width.slice(0, -2)) + offset <= 42) {
      setTextWidth(6);
      line.current.style.width = "42px";
    } else if (offset >= 25 || offset <= -60) {
      const newLineWidth =
        Number(line.current.style.width.slice(0, -2)) +
        (Math.floor(offset / 55) + 1) * 55;
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
    if (offset >= 25 || offset <= -40) {
      line.current.style.left =
        Number(line.current.style.left.slice(0, -2)) +
        Math.floor(offset / 55) * 55 +
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
        console.log("a");
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(-4);
      }
    } else if (mouseX > window.innerWidth - 100) {
      if (scrollingSpeed <= 0) {
        console.log("b");

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
        />
      </When>
    </>
  );
}
