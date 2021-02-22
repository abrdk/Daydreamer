import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/tasks.module.scss";
import { When, If, Then, Else } from "react-if";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";
import useEvent from "@react-hook/event";
import anime from "animejs";

import TasksRoot from "@/src/components/tasks/TasksRoot";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Task({
  task,
  setContainerHeight,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
}) {
  const userCtx = useContext(UsersContext);

  const {
    tasks,
    createTask,
    updateTask,
    tasksByProjectId,
    sortedTasksIds,
  } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);

  let taskDepth = -1;
  let currentTask = task;
  while (currentTask) {
    currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
    taskDepth += 1;
  }

  //subtasks
  let sortedTasks;
  if (projectByQueryId.owner == userCtx._id) {
    sortedTasks = tasks
      .filter((t) => t.root == task.root && t.project == projectByQueryId._id)
      .sort((task1, task2) => task1.order > task2.order);
  } else {
    sortedTasks = tasksByProjectId
      .filter((t) => t.root == task.root)
      .sort((task1, task2) => task1.order > task2.order);
  }

  let subtasks;
  if (projectByQueryId.owner == userCtx._id) {
    subtasks = tasks
      .filter((subtask) => subtask.root == task._id)
      .sort((task1, task2) => task1.order > task2.order);
  } else {
    subtasks = tasksByProjectId
      .filter((subtask) => subtask.root == task._id)
      .sort((task1, task2) => task1.order > task2.order);
  }

  useEffect(() => {
    setContainerHeight(document.querySelectorAll(".task").length * 55);
  }, [sortedTasks, isSubtasksOpened]);

  // task
  const input = useRef(null);
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);
  const [isUpdating, setUpdatingState] = useState(!task.name);

  const getNameWidth = () => {
    if (document.querySelector(`.task-${task._id}`)) {
      return document.querySelector(`.task-${task._id}`).clientWidth - 105;
    }
    return 0;
  };

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const startUpdateHandler = (e) => {
    if (projectByQueryId.owner == userCtx._id) {
      if (
        e.target != input.current &&
        e.target != arrow.current &&
        e.target != plus.current &&
        e.target != pencil.current
      ) {
        if (!isUpdating) {
          setUpdatingState(true);
        } else if (e.target != input.current) {
          setUpdatingState(false);
        }
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
    setIsSubtasksOpened(
      isSubtasksOpened.map((bool, i) => {
        if (i == sortedTasksIds.indexOf(task._id)) {
          return !bool;
        }
        return bool;
      })
    );
  };

  const createSubtask = async () => {
    let order;
    if (subtasks.length) {
      order = subtasks[subtasks.length - 1].order + 1;
    } else {
      order = 0;
    }

    if (!isSubtasksOpened[sortedTasksIds.indexOf(task._id)]) {
      openSubtasksHandler();
    }

    await createTask({
      ...task,
      _id: nanoid(),
      name: "",
      description: "",
      root: task._id,
      order,
      color: "258EFA",
    });
  };

  const editTaskHandler = () => {
    if (editedTask == task._id) {
      setEditedTask(null);
    } else {
      setEditedTask(task._id);
    }
  };

  useEffect(() => {
    if (input.current && fakeText.current) {
      const textWidth = fakeText.current.offsetWidth + 2;
      if (textWidth > 230) {
        input.current.style.width = "230px";
      } else {
        input.current.style.width = textWidth + "px";
      }
    }
    if (fakeText.current && pencil.current) {
      const offset = fakeText.current.offsetWidth + 39;
      if (offset - 39 > getNameWidth()) {
        pencil.current.style.left = getNameWidth() + 39 + "px";
      } else {
        pencil.current.style.left = offset + "px";
      }
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
    if (
      beforeTask &&
      beforeTask._id == sourceTask.root &&
      (!afterTask || afterTask.order == 1)
    ) {
      return;
    }
    const oldIndex = sourceTask.order;
    let isMoveBetweenRoots = false;
    let newRoot;
    let newIndex;

    if (beforeTask) {
      if (beforeTask.root != sourceTask.root) {
        isMoveBetweenRoots = true;
        if (afterTask) {
          if (afterTask.order == 0) {
            newRoot = afterTask.root;
            newIndex = 0;
          } else {
            newRoot = beforeTask.root;
            newIndex = beforeTask.order + 1;
          }
        } else {
          newRoot = beforeTask.root;
          newIndex = beforeTask.order + 1;
        }
      } else if (
        afterTask &&
        afterTask.order == 0 &&
        afterTask.root != sourceTask.root
      ) {
        isMoveBetweenRoots = true;
        newRoot = afterTask.root;
        newIndex = 0;
      }
    } else if (afterTask && !newIndex) {
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
      if (beforeTask) {
        if (
          beforeTask.root == sourceTask.root &&
          beforeTask.order + 1 == sourceTask.order
        ) {
          return;
        }
      }
      if (afterTask) {
        if (
          afterTask.root == sourceTask.root &&
          afterTask.order - 1 == sourceTask.order
        ) {
          return;
        }
      }

      if (beforeTask && afterTask) {
        if (beforeTask.root == sourceTask.root) {
          if (beforeTask.order > oldIndex) {
            newIndex = beforeTask.order;
          } else {
            newIndex = afterTask.order;
          }
        } else {
          newIndex = 0;
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
          (t) => t.root == sourceTask.root && t.project == projectByQueryId._id
        )
        .sort((task1, task2) => task1.order > task2.order)
        .slice(oldIndex + 1)
        .forEach((t) => {
          updateTask({ ...t, order: t.order - 1 });
        });

      notUpdatedTasks
        .filter((t) => t.root == newRoot && t.project == projectByQueryId._id)
        .sort((task1, task2) => task1.order > task2.order)
        .slice(newIndex)
        .forEach((t) => {
          updateTask({ ...t, order: t.order + 1 });
        });

      updateTask({ ...sourceTask, order: newIndex, root: newRoot });
    }
  };

  const addInitialClasses = (e) => {
    if (document.querySelectorAll(".task").length > 1) {
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
          setTimeout(() => {
            tasksElements[tasksElements.length - 2].classList.add("mb55");
          }, 100);
        } else {
          tasksElements[tasksElements.length - 1].classList.add("mb55");
        }
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
    draggedTask.current.style.transitionDuration = "0.3s";
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

  const getCurrenRoot = () => {
    if (beforeTask) {
      if (beforeTask.root != sourceTask.root) {
        if (afterTask) {
          if (afterTask.order == 0 || afterTask.order == 1) {
            return afterTask.root;
          }
          return beforeTask.root;
        }
        return beforeTask.root;
      } else if (
        afterTask &&
        afterTask.order == 0 &&
        afterTask.root != sourceTask.root
      ) {
        return afterTask.root;
      }
    } else if (afterTask) {
      if (afterTask.root != sourceTask.root) {
        return afterTask.root;
      }
    }
    return sourceTask.root;
  };
  useEffect(() => {
    if (draggedTask.current) {
      const currentRoot = getCurrenRoot();
      let taskDepth = -1;
      let currentTask = tasksByProjectId.find((t) => t.root == currentRoot);
      while (currentTask) {
        currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
        taskDepth += 1;
      }
      draggedTask.current.style.paddingLeft = 33 + 14 * taskDepth + "px";
      if (taskDepth) {
        draggedTask.current.style.color = "#949da7";
      } else {
        draggedTask.current.style.color = "#696f75";
      }
    }
  }, [afterTask, beforeTask, sourceTask]);

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
    if (projectByQueryId.owner == userCtx._id) {
      setIsSubtasksOpened(
        isSubtasksOpened.map((bool, i) => {
          if (i == sortedTasksIds.indexOf(task._id)) {
            return false;
          }
          return bool;
        })
      );
      setDraggingState(true);
      setInitialMousePisition({
        shiftX: e.clientX - e.target.getBoundingClientRect().left,
        shiftY: e.clientY - e.target.getBoundingClientRect().top,
      });
      addInitialClasses(e);
      setSourceTask(task);
    }
  };

  const dragEndHandler = () => {
    clearInterval(scrollingTimer);
    setScrollingTimer(null);
    setScrollingSpeed(0);

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
      boxShadow: [
        "15px 15px 50px rgba(9, 40, 72, 0.1)",
        "15px 15px 50px rgba(9, 40, 72, 0)",
      ],
      easing: "easeInOutQuad",
      duration: 300,
      complete: function (anim) {
        if (beforeTask || afterTask) {
          reorderHandler();
        }
        document.querySelectorAll(".task").forEach((taskElement) => {
          taskElement.classList.remove("animTranslateY");
          taskElement.classList.remove("plus55");
          taskElement.classList.remove("mb55");
        });
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
          <When condition={editedTask == task._id}>
            <div className={styles.verticalLineAbsolute}></div>
          </When>
          <When condition={subtasks.length}>
            <img
              className={
                isSubtasksOpened[sortedTasksIds.indexOf(task._id)]
                  ? styles.arrowDown
                  : styles.arrowRight
              }
              src={
                isSubtasksOpened[sortedTasksIds.indexOf(task._id)]
                  ? "/img/arrowDown.svg"
                  : "/img/arrowRightTask.svg"
              }
              alt=" "
            />
          </When>
          <Truncate lines={1} width={230}>
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
        <When condition={editedTask == task._id}>
          <div
            className={styles.verticalLine}
            style={{ left: -14 * taskDepth + "px" }}
          ></div>
        </When>
        <When condition={subtasks.length}>
          <img
            className={
              isSubtasksOpened[sortedTasksIds.indexOf(task._id)]
                ? styles.arrowDown
                : styles.arrowRight
            }
            src={
              isSubtasksOpened[sortedTasksIds.indexOf(task._id)]
                ? "/img/arrowDown.svg"
                : "/img/arrowRightTask.svg"
            }
            alt=" "
            ref={arrow}
            onClick={openSubtasksHandler}
          />
        </When>
        <span
          className={task.name ? styles.fakeText : styles.fakeTextVisible}
          ref={fakeText}
        >
          {task.name ? task.name : getDefaultName()}
        </span>
        <When condition={projectByQueryId.owner == userCtx._id}>
          <div
            className={styles.pencilContainer}
            ref={pencil}
            onClick={editTaskHandler}
          >
            <img src="/img/pencil.svg" alt=" " className={styles.pencil} />
          </div>
        </When>
        <If condition={isUpdating}>
          <Then>
            <input
              value={task.name}
              className={styles.input}
              ref={input}
              onChange={updateHandler}
              onBlur={blurHandler}
              style={{
                maxWidth: getNameWidth(),
              }}
            />
          </Then>
          <Else>
            <Truncate lines={1} width={getNameWidth()}>
              {task.name}
            </Truncate>
          </Else>
        </If>
        <When condition={projectByQueryId.owner == userCtx._id}>
          <img
            src="/img/plus.svg"
            alt=" "
            ref={plus}
            className={styles.plus}
            onClick={createSubtask}
          />
        </When>
      </div>

      <When
        condition={
          subtasks.length && isSubtasksOpened[sortedTasksIds.indexOf(task._id)]
        }
      >
        <div className={styles.subtasksWrapper}>
          <TasksRoot
            root={task._id}
            setContainerHeight={setContainerHeight}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            isSubtasksOpened={isSubtasksOpened}
            setIsSubtasksOpened={setIsSubtasksOpened}
          />
        </div>
      </When>
    </>
  );
}
