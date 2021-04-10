import { useContext } from "react";
import styles from "@/styles/taskEdit.module.scss";

import TrashBlueSvg from "@/src/components/svg/TrashBlueSvg";

import { TasksContext } from "@/src/context/TasksContext";

export default function TasksEdit({ task }) {
  const {
    tasksByProjectId,
    updateTask,
    deleteTask,
    setEditedTaskId,
  } = useContext(TasksContext);

  const handleDelete = () => {
    tasksByProjectId
      .filter((t) => t.root == task.root)
      .slice(task.order + 1)
      .forEach((t) => {
        updateTask({ ...t, order: t.order - 1 });
      });
    deleteTask(task._id);
    setEditedTaskId("");
  };

  return (
    <div className={styles.trashWrapper}>
      <div className={styles.trashIcon} onClick={handleDelete}>
        <TrashBlueSvg />
      </div>
    </div>
  );
}
