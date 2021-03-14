import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/tasks.module.scss";
import { When, If, Then, Else } from "react-if";
import Truncate from "react-truncate";
import { nanoid } from "nanoid";
import usePrevious from "@react-hook/previous";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import DraggedTask from "@/src/components/tasks/Task/DraggedTask";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Task({
  task,
  setContainerHeight,
  editedTask,
  setEditedTask,
}) {
  const userCtx = useContext(UsersContext);

  const {
    createTask,
    updateTask,
    tasksByProjectId,
    updateIsOpened,
  } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);

  let taskDepth = -1;
  let currentTask = task;
  while (currentTask) {
    currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
    taskDepth += 1;
  }

  //subtasks
  const sortedTasks = tasksByProjectId
    .filter((t) => t.root == task.root)
    .sort((task1, task2) => task1.order > task2.order);

  const subtasks = tasksByProjectId
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  useEffect(() => {
    setContainerHeight(document.querySelectorAll(".task").length * 55);
  }, [sortedTasks, task.isOpened]);

  // task
  const input = useRef(null);
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);
  const [isUpdating, setUpdatingState] = useState(!task.name);
  const prevIsUpdating = usePrevious(isUpdating);
  const [selectionStart, setSelectionStart] = useState(0);

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

  const updateHandler = (e) => {
    console.log("e.target.selectionStart", e.target.selectionStart);
    setSelectionStart(e.target.selectionStart);
    updateTask({ ...task, name: e.target.value });
  };

  const blurHandler = (e) => {
    setTimeout(() => setUpdatingState(false), 150);
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
  };
  useEffect(() => {
    if (!isUpdating && !task.name) {
      updateTask({ ...task, name: getDefaultName() });
    }
  }, [isUpdating]);

  const openSubtasksHandler = () => {
    updateIsOpened({ _id: task._id, isOpened: !task.isOpened });
  };

  const createSubtask = async () => {
    const order = subtasks.length ? subtasks[subtasks.length - 1].order + 1 : 0;

    if (!task.isOpened) {
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

  const editTaskHandler = () => {
    if (editedTask == task._id) {
      setEditedTask(null);
    } else {
      setEditedTask(task._id);
    }
  };

  const setTextWidth = () => {
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
  };

  useEffect(() => {
    setTextWidth();
  }, [task, isUpdating]);

  useEffect(() => {
    if (isUpdating && !prevIsUpdating) {
      setTimeout(() => {
        console.log("prevIsUpdating", prevIsUpdating);
        input.current.focus();
      }, 100);
    }
  }, [isUpdating]);

  useEffect(() => {
    if (input.current) {
      input.current.selectionStart = selectionStart;
      input.current.selectionEnd = selectionStart;
    }
  }, [task.name]);

  return (
    <>
      <DraggedTask
        task={task}
        editedTask={editedTask}
        subtasks={subtasks}
        startUpdateHandler={startUpdateHandler}
        sortedTasks={sortedTasks}
      >
        <When condition={editedTask == task._id}>
          <div
            className={styles.verticalLine}
            style={{ left: -14 * taskDepth + "px" }}
          ></div>
        </When>

        <When condition={subtasks.length}>
          <img
            className={task.isOpened ? styles.arrowDown : styles.arrowRight}
            src={
              task.isOpened ? "/img/arrowDown.svg" : "/img/arrowRightTask.svg"
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

        <div
          className={styles.pencilContainer}
          ref={pencil}
          onClick={editTaskHandler}
        >
          <img src="/img/pencil.svg" alt=" " className={styles.pencil} />
        </div>

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
              onFocus={(e) => console.log(e)}
            />
          </Then>

          <Else>
            <div className={styles.taskName}>
              <Truncate lines={1} width={getNameWidth()}>
                {task.name}
              </Truncate>
            </div>
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
      </DraggedTask>

      <When condition={subtasks.length && task.isOpened}>
        <div className={styles.subtasksWrapper}>
          <TasksRoot
            root={task._id}
            setContainerHeight={setContainerHeight}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
          />
        </div>
      </When>
    </>
  );
}
