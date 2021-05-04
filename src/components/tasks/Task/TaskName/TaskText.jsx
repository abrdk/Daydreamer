import styles from "@/styles/tasks.module.scss";
import Truncate from "react-truncate";
import { memo, useState } from "react";
import useMedia from "use-media";
import useEvent from "@react-hook/event";

const paddingRight = 70;
const paddingRightMobile = 50;
const taskOffsetLeft = 14;

function TaskText({ task, taskDepth }) {
  const isMobile = useMedia({ maxWidth: 576 });

  const paddingLeft = 33 + taskDepth * taskOffsetLeft;

  const [textWidth, setTextWidth] = useState(
    window.innerWidth < 576
      ? window.innerWidth - paddingRightMobile - paddingLeft
      : 335 - paddingRight - paddingLeft
  );

  useEvent(window, "resize", () => {
    if (isMobile) {
      setTextWidth(window.innerWidth - paddingRightMobile - paddingLeft);
    }
  });

  return (
    <div className={styles.taskName}>
      <Truncate lines={1} width={textWidth}>
        {task.name}
      </Truncate>
    </div>
  );
}

export default memo(
  TaskText,
  (prevProps, nextProps) => prevProps.task.name == nextProps.task.name
);
