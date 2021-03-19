import { useContext } from "react";
import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";

import { TasksContext } from "@/src/context/tasks/TasksContext";

const taskOffsetLeft = -14;

export default function VerticalLine({ task, editedTask }) {
  const { tasksByProjectId } = useContext(TasksContext);

  let taskDepth = -1;
  let currentTask = task;
  while (currentTask) {
    currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
    taskDepth += 1;
  }

  const isTaskEditing = () => editedTask == task._id;

  return (
    <When condition={isTaskEditing()}>
      <div
        className={styles.verticalLine}
        style={{ left: taskOffsetLeft * taskDepth }}
      ></div>
    </When>
  );
}
