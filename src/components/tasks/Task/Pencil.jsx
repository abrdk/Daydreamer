import styles from "@/styles/tasks.module.scss";
import { useState, useEffect, useContext } from "react";

import { TasksContext } from "@/src/context/TasksContext";

const taskPaddingLeft = 33;
const distanceToText = 6;
const taskOffsetLeft = 14;
const maxPencilLeft = 266;

export default function Pencil({
  task,
  fakeTextRef,
  pencilRef,
  isUpdating,
  taskDepth,
}) {
  const { editedTaskId, setEditedTaskId } = useContext(TasksContext);

  const [pencilLeft, setPencilLeft] = useState(0);

  const startEditTask = () => {
    if (editedTaskId == task._id) {
      setEditedTaskId("");
    } else {
      setEditedTaskId(task._id);
    }
  };

  const getPencilLeft = () => {
    if (fakeTextRef.current) {
      const left =
        fakeTextRef.current.offsetWidth +
        taskPaddingLeft +
        distanceToText +
        taskDepth * taskOffsetLeft;

      if (left > maxPencilLeft) {
        return maxPencilLeft;
      }
      return left;
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
        alt="edit"
        className={styles.pencil}
      />
    </div>
  );
}
