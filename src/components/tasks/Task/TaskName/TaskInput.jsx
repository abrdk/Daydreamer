import styles from "@/styles/tasks.module.scss";
import React, { useContext, useEffect, useState, useRef } from "react";

import { TasksContext } from "@/src/context/TasksContext";

const taskOffsetLeft = 14;
const paddingRight = 105;
const taskWidth = 335;

function TaskInput({
  task,
  isUpdating,
  setUpdatingState,
  taskDepth,
  fakeTextRef,
}) {
  const { updateTask, whereEditNewTask, setWhereEditNewTask } = useContext(
    TasksContext
  );

  const inputRef = useRef(null);

  const paddingLeft = taskDepth * taskOffsetLeft;

  const [nameState, setNameState] = useState(task.name);
  const [inputWidth, setInputWidth] = useState(taskWidth);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const handleNameUpdate = (e) => {
    setNameState(e.target.value);
    updateTask({ ...task, name: e.target.value });
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      setNameState(getDefaultName());
      updateTask({ ...task, name: getDefaultName() });
    }
    setUpdatingState(false);
  };

  const focusOnInput = () => {
    if (
      isUpdating &&
      inputRef.current &&
      (whereEditNewTask == "menu" || whereEditNewTask == "")
    ) {
      inputRef.current.focus();
      setWhereEditNewTask("");
    }
  };

  const getInputWidth = () => {
    if (fakeTextRef.current) {
      const currentWidth = fakeTextRef.current.offsetWidth + 5;
      if (currentWidth > taskWidth - paddingRight - paddingLeft) {
        return taskWidth - paddingRight - paddingLeft;
      }
      return currentWidth;
    }
    return 0;
  };

  useEffect(() => {
    focusOnInput();
  }, [isUpdating, inputRef.current]);

  useEffect(() => {
    setInputWidth(getInputWidth());
  }, [nameState]);

  useEffect(
    () => () => {
      if (!task.name) {
        updateTask({ ...task, name: getDefaultName() });
      }
    },
    [task.name]
  );

  return (
    <input
      value={nameState}
      className={styles.input}
      ref={inputRef}
      onChange={handleNameUpdate}
      onBlur={handleBlur}
      style={{
        width: inputWidth,
        color: taskDepth > 0 ? "#949da7" : "#696f75",
      }}
    />
  );
}

export default TaskInput;
