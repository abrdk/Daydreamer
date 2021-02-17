import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/tasks.module.scss";
import { When, If, Then, Else } from "react-if";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";
import useEvent from "@react-hook/event";
import anime from "animejs";

import TasksRoot from "@/src/components/tasks/TasksRoot";

import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Task({ task, setContainerHeight }) {
  const { tasks, createTask, updateTask } = useContext(TasksContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }

  //subtasks
  const [isSubtasksOpened, setSubtasksState] = useState(false);
  const filteredTasks = tasks.filter(
    (t) => t.root == task.root && t.project == currentProject._id
  );
  const sortedTasks = filteredTasks.sort(
    (task1, task2) => task1.order > task2.order
  );
  const subtasks = tasks
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  useEffect(() => {
    setContainerHeight(document.querySelectorAll(".task").length * 55);
  }, [filteredTasks, isSubtasksOpened]);

  // task
  const input = useRef(null);
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const [isUpdating, setUpdatingState] = useState(!task.name);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const startUpdateHandler = (e) => {
    if (
      e.target != input.current &&
      e.target != arrow.current &&
      e.target != plus.current
    ) {
      if (!isUpdating) {
        setUpdatingState(true);
      } else if (e.target != input.current) {
        setUpdatingState(false);
      }
    }
  };

  const updateHandler = async (e) => {
    await updateTask({ ...task, name: e.target.value });
  };

  const blurHandler = async (e) => {
    setTimeout(() => setUpdatingState(false), 150);
    if (!e.target.value) {
      await updateTask({ ...task, name: getDefaultName() });
    }
  };
  useEffect(() => {
    const setDefaultName = async () => {
      await updateTask({ ...task, name: getDefaultName() });
    };
    if (!isUpdating && !task.name) {
      setDefaultName();
    }
  }, [isUpdating]);

  const openSubtasksHandler = () => {
    setSubtasksState(!isSubtasksOpened);
  };

  const createSubtask = async () => {
    let order;
    if (subtasks.length) {
      order = subtasks[subtasks.length - 1].order + 1;
    } else {
      order = 0;
    }

    if (!isSubtasksOpened) {
      openSubtasksHandler();
    }

    await createTask({
      ...task,
      _id: nanoid(),
      name: "",
      description: "",
      root: task._id,
      order,
    });
  };

  useEffect(() => {
    if (input.current && fakeText.current) {
      input.current.style.width = fakeText.current.offsetWidth + 2 + "px";
    }
  }, [task, isUpdating]);

  useEffect(() => {
    if (isUpdating) {
      setTimeout(() => input.current.focus(), 100);
    }
  }, [isUpdating]);

  //drag code
  const draggedTask = useRef(null);
  const [isDragging, setDraggingState] = useState(false);
  const [scrollingSpeed, setScrollingSpeed] = useState(0);
  const [scrollingTimer, setScrollingTimer] = useState(null);
  const [initialMousePosition, setInitialMousePisition] = useState({
    shiftX: 0,
    shiftY: 0,
  });
  const [sourceTask, setSourceTask] = useState(null);
  const [beforeTask, setBeforeTask] = useState(null);
  const [afterTask, setAfterTask] = useState(null);

  const reorderHandler = () => {
    const oldIndex = sourceTask.order;
    let isMoveBetweenRoots = false;
    let newRoot;
    let newIndex;

    if (beforeTask) {
      if (
        beforeTask.root != sourceTask.root &&
        sourceTask.root != beforeTask._id
      ) {
        isMoveBetweenRoots = true;
        newRoot = beforeTask.root;
        newIndex = beforeTask.order + 1;
      }
    }
    if (afterTask && !newIndex) {
      if (afterTask.root != sourceTask.root) {
        isMoveBetweenRoots = true;
        newRoot = afterTask.root;
        if (afterTask.order) {
          newIndex = afterTask.order - 1;
        } else {
          newIndex = 0;
        }
      }
    }

    if (!isMoveBetweenRoots) {
      if (beforeTask && afterTask) {
        if (beforeTask.order > oldIndex && beforeTask.root == sourceTask.root) {
          newIndex = beforeTask.order;
        } else {
          newIndex = afterTask.order;
        }
      } else if (!beforeTask) {
        newIndex = 0;
      } else if (!afterTask) {
        newIndex = sortedTasks.length - 1;
      }

      if (oldIndex != newIndex) {
        updateTask({ ...sourceTask, order: newIndex });
        if (newIndex > oldIndex) {
          sortedTasks.slice(oldIndex + 1, newIndex + 1).forEach((t) => {
            updateTask({ ...t, order: t.order - 1 });
          });
        } else {
          sortedTasks.slice(newIndex, oldIndex).forEach((t) => {
            updateTask({ ...t, order: t.order + 1 });
          });
        }
      }
    } else {
      const notUpdatedTasks = tasks;

      notUpdatedTasks
        .filter(
          (t) => t.root == sourceTask.root && t.project == currentProject._id
        )
        .sort((task1, task2) => task1.order > task2.order)
        .slice(oldIndex + 1)
        .forEach((t) => {
          updateTask({ ...t, order: t.order - 1 });
        });

      notUpdatedTasks
        .filter((t) => t.root == newRoot && t.project == currentProject._id)
        .sort((task1, task2) => task1.order > task2.order)
        .slice(newIndex)
        .forEach((t) => {
          updateTask({ ...t, order: t.order + 1 });
        });

      updateTask({ ...sourceTask, order: newIndex, root: newRoot });
    }
  };

  const addInitialClasses = (e) => {
    let tasksElements = [];
    document.querySelectorAll(".task").forEach((taskElement, i) => {
      if (taskElement.getBoundingClientRect().top > e.clientY) {
        taskElement.classList.add("plus55");
      }
      setTimeout(() => {
        taskElement.classList.add("animTranslateY");
      }, 100);
      tasksElements.push(taskElement);
    });

    if (e.target.classList.contains(`task-${task._id}`)) {
      if (
        tasksElements[tasksElements.length - 1].classList.contains(
          `task-${task._id}`
        )
      ) {
        tasksElements[tasksElements.length - 2].classList.add("mb55");
      } else {
        tasksElements[tasksElements.length - 1].classList.add("mb55");
      }
    }
  };

  const getTaskFromDomElement = (el) => {
    let res;
    el.classList.forEach((cl) => {
      if (cl.startsWith("task-")) {
        res = tasks.find((t) => t._id == cl.slice(5));
      }
    });
    return res;
  };

  const addAnimationClassesAndSetTasks = () => {
    let beforeTasks = [];
    let afterTasks = [];
    const tasksElements = document.querySelectorAll(".task");
    tasksElements.forEach((taskElement, i) => {
      const currentTask = getTaskFromDomElement(taskElement);
      if (
        taskElement.getBoundingClientRect().top >
        draggedTask.current.getBoundingClientRect().top - 10
      ) {
        afterTasks.push(currentTask);
        taskElement.classList.add("plus55");
      } else {
        if (!taskElement.classList.contains("hidden")) {
          beforeTasks.push(currentTask);
        }
        taskElement.classList.remove("plus55");
      }
    });

    if (beforeTasks.length) {
      setBeforeTask(beforeTasks[beforeTasks.length - 1]);
    } else {
      setBeforeTask(null);
    }

    if (afterTasks.length) {
      setAfterTask(afterTasks[0]);
    } else {
      setAfterTask(null);
    }
  };

  const addScroll = () => {
    let scrollbar = document.querySelector(".ScrollbarsCustom-Scroller");
    const scrollbarRect = scrollbar.getBoundingClientRect();
    const draggedTaskRect = draggedTask.current.getBoundingClientRect();
    if (
      scrollbarRect.bottom - draggedTaskRect.bottom < 55 &&
      draggedTaskRect.top - scrollbarRect.top > 0
    ) {
      if (scrollingSpeed <= 0) {
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(4);
      }
    } else if (
      draggedTaskRect.top - scrollbarRect.top < 55 &&
      draggedTaskRect.top - scrollbarRect.top > 0
    ) {
      if (scrollingSpeed >= 0) {
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(-4);
      }
    } else {
      clearInterval(scrollingTimer);
      setScrollingTimer(null);
      setScrollingSpeed(0);
    }
  };

  const moveClone = (e) => {
    const { shiftX, shiftY } = initialMousePosition;
    draggedTask.current.style.left = e.clientX - shiftX + "px";
    draggedTask.current.style.top = e.clientY - shiftY + "px";
  };

  const dragStartHandler = (e) => {
    setSubtasksState(false);
    setDraggingState(true);
    setInitialMousePisition({
      shiftX: e.clientX - e.target.getBoundingClientRect().left,
      shiftY: e.clientY - e.target.getBoundingClientRect().top,
    });
    addInitialClasses(e);
    setSourceTask(task);
  };

  const dragEndHandler = () => {
    let top;
    if (beforeTask) {
      const beforeTaskElement = document.querySelector(
        `.task-${beforeTask._id}`
      );
      top = beforeTaskElement.getBoundingClientRect().bottom;
    } else {
      top = 167;
    }

    anime({
      targets: ".draggedTask",
      top: `${top}px`,
      left: "0px",
      easing: "easeInOutQuad",
      duration: 300,
      complete: function (anim) {
        reorderHandler();
        document.querySelectorAll(".task").forEach((taskElement) => {
          taskElement.classList.remove("animTranslateY");
          taskElement.classList.remove("plus55");
          taskElement.classList.remove("mb55");
        });
        clearInterval(scrollingTimer);
        setScrollingTimer(null);
        setScrollingSpeed(0);
        setDraggingState(false);
        setInitialMousePisition({
          shiftX: 0,
          shiftY: 0,
        });
        setSourceTask(null);
        setBeforeTask(null);
        setAfterTask(null);
      },
    });
  };

  const dragoverHandler = (e) => {
    if (isDragging) {
      moveClone(e);
      addAnimationClassesAndSetTasks();
      addScroll();
    }
  };

  useEffect(() => {
    if (scrollingSpeed) {
      setScrollingTimer(
        setInterval(() => {
          document
            .querySelector(".ScrollbarsCustom-Scroller")
            .scrollBy(0, scrollingSpeed);
        }, 10)
      );
    }
  }, [scrollingSpeed]);

  useEvent(document, "dragover", (e) => {
    dragoverHandler(e);
  });

  useEvent(
    document.querySelector(".ScrollbarsCustom-Scroller"),
    "scroll",
    (e) => {
      if (isDragging) {
        addAnimationClassesAndSetTasks();
      }
    }
  );

  return (
    <>
      <When condition={isDragging}>
        <div
          ref={draggedTask}
          className={
            styles.task + ` task-${task._id} draggedTask ` + styles.dragged
          }
        >
          <When condition={subtasks.length}>
            <img
              className={
                isSubtasksOpened ? styles.arrowDown : styles.arrowRight
              }
              src={
                isSubtasksOpened
                  ? "/img/arrowDown.svg"
                  : "/img/arrowRightTask.svg"
              }
              alt=" "
            />
          </When>
          <Truncate lines={1} width={240}>
            {task.name}
          </Truncate>
        </div>
      </When>
      <div
        className={
          isDragging
            ? styles.task + ` task task-${task._id} hidden ` + styles.hidden
            : styles.task + ` task task-${task._id}`
        }
        onClick={startUpdateHandler}
        draggable
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <When condition={subtasks.length}>
          <img
            className={isSubtasksOpened ? styles.arrowDown : styles.arrowRight}
            src={
              isSubtasksOpened
                ? "/img/arrowDown.svg"
                : "/img/arrowRightTask.svg"
            }
            alt=" "
            ref={arrow}
            onClick={openSubtasksHandler}
          />
        </When>
        <If condition={isUpdating}>
          <Then>
            <input
              value={task.name}
              className={styles.input}
              ref={input}
              onChange={updateHandler}
              onBlur={blurHandler}
            />
            <span
              className={task.name ? styles.fakeText : styles.fakeTextVisible}
              ref={fakeText}
            >
              {task.name ? task.name : getDefaultName()}
            </span>
          </Then>
          <Else>
            <Truncate lines={1} width={240}>
              {task.name}
            </Truncate>
          </Else>
        </If>
        <img
          src="/img/plus.svg"
          alt=" "
          ref={plus}
          className={styles.plus}
          onClick={createSubtask}
        />
      </div>

      <When condition={subtasks.length && isSubtasksOpened}>
        <div className={styles.subtasksWrapper}>
          <TasksRoot root={task._id} setContainerHeight={setContainerHeight} />
        </div>
      </When>
    </>
  );
}
