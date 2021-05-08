import styles from "@/styles/tasks.module.scss";
import { useState, useEffect, useContext, memo } from "react";

import PencilSvg from "@/src/components/svg/PencilSvg";

import { TasksContext } from "@/src/context/TasksContext";

const taskPaddingLeft = 33;
const distanceToText = 6;
const taskOffsetLeft = 14;
const maxPencilLeft = 266;

function EditTaskIconInner({
  task,
  fakeTextRef,
  pencilRef,
  taskDepth,
  editedTaskId,
  setEditedTaskId,
}) {
  const [pencilLeft, setPencilLeft] = useState(0);

  const hexToRgb = (hex, opacity) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(
          result[2],
          16
        )}, ${parseInt(result[3], 16)}, ${opacity})`
      : null;
  };

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
  }, [task.name]);

  return (
    <>
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
      <div className={styles.circleIconWrapper}>
        <div
          className={styles.circleIcon}
          onClick={startEditTask}
          style={{ borderColor: hexToRgb("#" + task.color, 0.2) }}
        >
          <div
            className={styles.circleIconInner}
            style={{ background: "#" + task.color }}
          ></div>
        </div>
      </div>
    </>
  );
}

EditTaskIconInner = memo(
  EditTaskIconInner,
  (prevProps, nextProps) =>
    prevProps.task.name == nextProps.task.name &&
    prevProps.task.color == nextProps.task.color &&
    prevProps.taskDepth == nextProps.taskDepth &&
    prevProps.editedTaskId == nextProps.editedTaskId
);

export default function EditTaskIcon({
  task,
  fakeTextRef,
  pencilRef,
  taskDepth,
}) {
  const { editedTaskId, setEditedTaskId } = useContext(TasksContext);

  return (
    <EditTaskIconInner
      task={task}
      fakeTextRef={fakeTextRef}
      pencilRef={pencilRef}
      taskDepth={taskDepth}
      editedTaskId={editedTaskId}
      setEditedTaskId={setEditedTaskId}
    />
  );
}
