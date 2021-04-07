import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { useContext } from "react";

import { TasksContext } from "@/src/context/TasksContext";

export default function TaskVerticalLine({ task }) {
  const { editedTaskId } = useContext(TasksContext);
  const isTaskEditing = () => editedTaskId == task._id;

  return (
    <When condition={isTaskEditing()}>
      <div className={styles.verticalLine}></div>
    </When>
  );
}
