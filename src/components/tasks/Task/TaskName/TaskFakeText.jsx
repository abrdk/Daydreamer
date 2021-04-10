import styles from "@/styles/tasks.module.scss";
import React from "react";
import { memo } from "react";

function TaskFakeText({ task, fakeTextRef }) {
  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  return (
    <span
      className={task.name ? styles.fakeText : styles.fakeTextVisible}
      ref={fakeTextRef}
    >
      {task.name || getDefaultName()}
    </span>
  );
}

export default memo(
  TaskFakeText,
  (prevProps, nextProps) => prevProps.task.name == nextProps.task.name
);
