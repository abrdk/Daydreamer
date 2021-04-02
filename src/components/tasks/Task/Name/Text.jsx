import styles from "@/styles/tasks.module.scss";
import Truncate from "react-truncate";

const paddingRight = 70;
const taskOffsetLeft = 14;

export default function Text({ task, taskDepth }) {
  const paddingLeft = 33 + taskDepth * taskOffsetLeft;

  const getNameWidth = () => {
    const taskElement = document.querySelector(`.task-${task._id}`);
    if (taskElement) {
      return taskElement.clientWidth - paddingRight - paddingLeft;
    }
    return 0;
  };

  return (
    <div className={styles.taskName}>
      <Truncate lines={1} width={getNameWidth()}>
        {task.name}
      </Truncate>
    </div>
  );
}
