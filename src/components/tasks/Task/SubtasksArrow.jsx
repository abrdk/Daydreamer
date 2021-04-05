import styles from "@/styles/tasks.module.scss";
import { useContext } from "react";
import { When } from "react-if";

import { TasksContext } from "@/src/context/tasks/TasksContext";

const taskOffsetLeft = 14;

export default function SubtasksArrow({ task, arrow, taskDepth }) {
  const { tasksByProjectId, updateIsOpened, isTaskOpened } = useContext(
    TasksContext
  );

  const subtasks = tasksByProjectId.filter(
    (subtask) => subtask.root == task._id
  );

  const defaultLeft = isTaskOpened[task._id] ? 2 : 7;

  const openSubtasks = () => {
    updateIsOpened({ _id: task._id, isOpened: !isTaskOpened[task._id] });
  };

  return (
    <When condition={subtasks.length}>
      <img
        className={
          isTaskOpened[task._id] ? styles.arrowDown : styles.arrowRight
        }
        src={
          isTaskOpened[task._id]
            ? "/img/arrowDown.svg"
            : "/img/arrowRightTask.svg"
        }
        alt=" "
        ref={arrow}
        onClick={openSubtasks}
        style={{
          left: defaultLeft + taskDepth * taskOffsetLeft,
        }}
      />
    </When>
  );
}
