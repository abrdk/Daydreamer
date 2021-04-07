import styles from "@/styles/tasks.module.scss";
import { useState, useEffect, useContext } from "react";

import PencilSvg from "@/src/components/svg/PencilSvg";

import { TasksContext } from "@/src/context/TasksContext";

const taskPaddingLeft = 33;
const distanceToText = 6;
const taskOffsetLeft = 14;
const maxPencilLeft = 266;

export default function EditTaskIcon({
  task,
  fakeTextRef,
  pencilRef,
  isUpdating,
  taskDepth,
}) {
  const { editedTaskId, setEditedTaskId } = useContext(TasksContext);

  const [pencilLeft, setPencilLeft] = useState(0);

  const startEditTask = (e) => {
    e.stopPropagation();
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
      <div ref={pencilRef} className={styles.pencil}>
        <PencilSvg />
      </div>
    </div>
  );
}
