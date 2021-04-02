import styles from "@/styles/tasks.module.scss";
import { useContext, useEffect, useState } from "react";

import { TasksContext } from "@/src/context/tasks/TasksContext";

const paddingRight = 105;

export default function Input({
  task,
  inputRef,
  isUpdating,
  setUpdatingState,
  taskDepth,
}) {
  const { updateTask } = useContext(TasksContext);

  const [selectionStart, setSelectionStart] = useState(task.name.length);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const getInputWidth = () => {
    const taskElement = document.querySelector(`.task-${task._id}`);
    if (taskElement) {
      return taskElement.clientWidth - paddingRight;
    }
    return 0;
  };

  const preventCursorShift = () => {
    if (inputRef.current) {
      inputRef.current.selectionStart = selectionStart;
      inputRef.current.selectionEnd = selectionStart;
    }
  };

  const handleNameUpdate = (e) => {
    setSelectionStart(e.target.selectionStart);
    updateTask({ ...task, name: e.target.value });
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
    setUpdatingState(false);
  };

  const focusOnInput = () => {
    if (isUpdating && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusOnInput();
  }, [isUpdating, inputRef.current]);

  useEffect(() => {
    preventCursorShift();
  }, [task.name]);

  return (
    <input
      value={task.name}
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
