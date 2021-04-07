import styles from "@/styles/tasks.module.scss";

export default function TaskFakeText({ task, fakeTextRef }) {
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
