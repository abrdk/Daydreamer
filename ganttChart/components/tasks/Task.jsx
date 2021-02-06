import { useState, useContext, useEffect, useRef } from "react";
import styles from "../../../styles/tasks.module.css";

import { TasksContext } from "../../context/tasks/TasksContext";

import { When, If, Then, Else } from "react-if";
import TextTruncate from "react-text-truncate";
import { nanoid } from "nanoid";
import useSWR from "swr";

export default function Task({
  task,
  hasSubtasks,
  isSubtasksOpened,
  setSubtasksState,
}) {
  const { tasks, createTask, updateTask } = useContext(TasksContext);
  const subtasks = tasks
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  const input = useRef(null);
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const [isUpdating, setUpdatingState] = useState(!task.name);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const startUpdateHandle = (e) => {
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

  const handleUpdate = (e) => {
    updateTask({ ...task, name: e.target.value });
  };

  const handleBlur = (e) => {
    setTimeout(() => setUpdatingState(false), 150);
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
  };

  const openSubtasksHandle = () => {
    setSubtasksState(
      isSubtasksOpened.map((bool, i) => {
        if (i == task.order) {
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

    if (!isSubtasksOpened[task.order]) {
      openSubtasksHandle();
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
      input.current.style.width = fakeText.current.offsetWidth + "px";
    }
  }, [task, isUpdating]);

  useEffect(() => {
    if (isUpdating) {
      setTimeout(() => input.current.focus(), 100);
    }
  }, [isUpdating]);

  return (
    <div className={styles.task} onClick={startUpdateHandle}>
      <When condition={hasSubtasks}>
        <img
          className={
            isSubtasksOpened[task.order] ? styles.arrowDown : styles.arrowRight
          }
          src={
            isSubtasksOpened[task.order]
              ? "/img/arrowDown.svg"
              : "/img/arrowRightTask.svg"
          }
          alt=" "
          ref={arrow}
          onClick={openSubtasksHandle}
        />
      </When>
      <If condition={isUpdating}>
        <Then>
          <input
            value={task.name}
            className={styles.input}
            ref={input}
            onChange={handleUpdate}
            onBlur={handleBlur}
          />
          <span
            className={task.name ? styles.fakeText : styles.fakeTextVisible}
            ref={fakeText}
          >
            {task.name ? task.name : getDefaultName()}
          </span>
        </Then>
        <Else>
          <TextTruncate
            line={1}
            element="span"
            truncateText="…"
            text={task.name}
            containerClassName={styles.textWrapper}
          />
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
  );
}
