import styles from "@/styles/tasks.module.scss";
import Truncate from "react-truncate";
import { memo } from "react";

const paddingRight = 70;
const taskOffsetLeft = 14;

function TaskText({ task, taskDepth }) {
  const paddingLeft = 33 + taskDepth * taskOffsetLeft;

  return (
    <div className={styles.taskName}>
      <Truncate lines={1} width={335 - paddingRight - paddingLeft}>
        {task.name}
      </Truncate>
    </div>
  );
}

export default memo(
  TaskText,
  (prevProps, nextProps) => prevProps.task.name == nextProps.task.name
);
