import styles from "@/styles/tasks.module.scss";
import Truncate from "react-truncate";

const paddingRight = 105;

export default function Text({ task }) {
  const getNameWidth = () => {
    const taskElement = document.querySelector(`.task-${task._id}`);
    if (taskElement) {
      return taskElement.clientWidth - paddingRight;
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
