import styles from "@/styles/tasks.module.scss";
import { useContext } from "react";
import { When } from "react-if";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function SubtasksArrow({ task, arrow }) {
  const { tasksByProjectId, updateIsOpened } = useContext(TasksContext);

  const subtasks = tasksByProjectId.filter(
    (subtask) => subtask.root == task._id
  );

  const openSubtasks = () => {
    updateIsOpened({ _id: task._id, isOpened: !task.isOpened });
  };

  return (
    <When condition={subtasks.length}>
      <img
        className={task.isOpened ? styles.arrowDown : styles.arrowRight}
        src={task.isOpened ? "/img/arrowDown.svg" : "/img/arrowRightTask.svg"}
        alt=" "
        ref={arrow}
        onClick={openSubtasks}
      />
    </When>
  );
}
