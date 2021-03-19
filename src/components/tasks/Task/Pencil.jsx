import styles from "@/styles/tasks.module.scss";
import { useState, useEffect } from "react";

const taskPaddingLeft = 33;
const distanceToText = 6;
const taskPaddingRight = 105;

export default function Pencil({
  task,
  fakeTextRef,
  pencilRef,
  isUpdating,
  editedTask,
  setEditedTask,
}) {
  const [pencilLeft, setPencilLeft] = useState(0);

  const startEditTask = () => {
    if (editedTask == task._id) {
      setEditedTask(null);
    } else {
      setEditedTask(task._id);
    }
  };

  const getNameWidth = () => {
    const taskElement = document.querySelector(`.task-${task._id}`);
    if (taskElement) {
      return taskElement.clientWidth - taskPaddingRight;
    }
    return 0;
  };

  const getPencilLeft = () => {
    if (fakeTextRef.current) {
      const left = fakeTextRef.current.offsetWidth;
      if (left > getNameWidth()) {
        return getNameWidth() + taskPaddingLeft + distanceToText;
      }
      return left + taskPaddingLeft + distanceToText;
    }
    return 0;
  };

  useEffect(() => {
    setPencilLeft(getPencilLeft());
  }, [task, isUpdating, fakeTextRef.current]);

  return (
    <div
      className={styles.pencilContainer}
      onClick={startEditTask}
      style={{
        left: pencilLeft,
      }}
    >
      <img
        ref={pencilRef}
        src="/img/pencil.svg"
        alt=" "
        className={styles.pencil}
      />
    </div>
  );
}
