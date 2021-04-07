import styles from "@/styles/tasks.module.scss";
import { useContext } from "react";
import { When, If, Then, Else } from "react-if";

import ArrowDownSvg from "@/src/components/svg/ArrowDownSvg";
import ArrowRightSvg from "@/src/components/svg/ArrowRightSvg";

import { TasksContext } from "@/src/context/TasksContext";

const taskOffsetLeft = 14;

export default function SubtasksArrow({ task, arrow, taskDepth }) {
  const { tasksByProjectId, updateIsOpened, isTaskOpened } = useContext(
    TasksContext
  );

  const subtasks = tasksByProjectId.filter(
    (subtask) => subtask.root == task._id
  );

  const defaultLeft = isTaskOpened[task._id] ? 2 : 7;

  const openSubtasks = (e) => {
    e.stopPropagation();
    updateIsOpened({ _id: task._id, isOpened: !isTaskOpened[task._id] });
  };

  return (
    <When condition={subtasks.length}>
      <If condition={isTaskOpened[task._id]}>
        <Then>
          <div
            className={styles.arrowDown}
            ref={arrow}
            onClick={openSubtasks}
            style={{
              left: defaultLeft + taskDepth * taskOffsetLeft,
            }}
          >
            <ArrowDownSvg />
          </div>
        </Then>
        <Else>
          <div
            className={styles.arrowRight}
            ref={arrow}
            onClick={openSubtasks}
            style={{
              left: defaultLeft + taskDepth * taskOffsetLeft,
            }}
          >
            <ArrowRightSvg />
          </div>
        </Else>
      </If>
    </When>
  );
}
