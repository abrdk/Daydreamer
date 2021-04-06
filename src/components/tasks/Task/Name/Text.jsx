import styles from "@/styles/tasks.module.scss";
import Truncate from "react-truncate";

const paddingRight = 70;
const taskOffsetLeft = 14;

export default function Text({ task, taskDepth }) {
  const paddingLeft = 33 + taskDepth * taskOffsetLeft;

  return (
    <div className={styles.taskName}>
      <Truncate lines={1} width={335 - paddingRight - paddingLeft}>
        {task.name}
      </Truncate>
    </div>
  );
}
