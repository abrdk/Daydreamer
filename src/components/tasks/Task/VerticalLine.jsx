import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { useContext } from "react";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function VerticalLine({ task }) {
  const { editedTaskId } = useContext(TasksContext);
  const isTaskEditing = () => editedTaskId == task._id;

  return (
    <When condition={isTaskEditing()}>
      <div className={styles.verticalLine} style={{ left: 0 }}></div>
    </When>
  );
}
