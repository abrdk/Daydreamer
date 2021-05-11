import styles from "@/styles/tasks.module.scss";
import React, { useContext, useEffect, useState, useRef } from "react";
import useEvent from "@react-hook/event";

import { TasksContext } from "@/src/context/TasksContext";

const taskOffsetLeft = 14;
const paddingRight = 105;
const paddingRightMobile = 85;
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
      setNameState(task.name);
      setWhereEditNewTask("");
    }
  };

  const getInputWidth = () => {
    if (fakeTextRef.current) {
      const currentWidth = fakeTextRef.current.offsetWidth + 5;
      if (window.innerWidth >= 576) {
        if (currentWidth > taskWidth - paddingRight - paddingLeft) {
          return taskWidth - paddingRight - paddingLeft;
        }
      } else if (
        currentWidth >
        window.innerWidth - paddingRightMobile - paddingLeft
      ) {
        return window.innerWidth - paddingRightMobile - paddingLeft;
      }
      return currentWidth;
    }
    return 0;
  };

  useEvent(window, "resize", () => {
    setInputWidth(getInputWidth());
  });

  useEffect(() => {
    focusOnInput();
  }, [isUpdating]);

  useEffect(() => {
    setInputWidth(getInputWidth());
  }, [nameState]);

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
