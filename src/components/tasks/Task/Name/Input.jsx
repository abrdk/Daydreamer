import styles from "@/styles/tasks.module.scss";
import { useContext, useEffect, useState } from "react";

import { TasksContext } from "@/src/context/tasks/TasksContext";

const taskOffsetLeft = 14;
const paddingRight = 105;

export default function Input({
  task,
  inputRef,
  isUpdating,
  setUpdatingState,
  taskDepth,
}) {
  const { updateTask, whereEditNewTask, setWhereEditNewTask } = useContext(
    TasksContext
  );

  const paddingLeft = taskDepth * taskOffsetLeft;

  const [nameState, setNameState] = useState(task.name);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const getInputWidth = () => {
    const taskElement = document.querySelector(`.task-${task._id}`);
    if (taskElement) {
      return taskElement.clientWidth - paddingRight - paddingLeft;
    }
    return 0;
  };

  const handleNameUpdate = (e) => {
    setNameState(e.target.value);
    updateTask({ ...task, name: e.target.value });
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
    setUpdatingState(false);
  };

  const focusOnInput = () => {
    if (isUpdating && inputRef.current && whereEditNewTask == "menu") {
      inputRef.current.focus();
      setWhereEditNewTask("");
    }
  };

  useEffect(() => {
    focusOnInput();
  }, [isUpdating, inputRef.current]);

  return (
    <input
      value={nameState}
      className={styles.input}
      ref={inputRef}
      onChange={handleNameUpdate}
      onBlur={handleBlur}
      style={{
        width: getInputWidth(),
        color: taskDepth > 0 ? "#949da7" : "#696f75",
      }}
    />
  );
}
