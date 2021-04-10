import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { useContext, memo } from "react";

import { TasksContext } from "@/src/context/TasksContext";

function InnerTaskVerticalLine({ task, editedTaskId }) {
  const isTaskEditing = () => editedTaskId == task._id;

  return (
    <When condition={isTaskEditing()}>
      <div className={styles.verticalLine}></div>
    </When>
  );
}

InnerTaskVerticalLine = memo(
  InnerTaskVerticalLine,
  (prevProps, nextProps) => prevProps.editedTaskId == nextProps.editedTaskId
);
export default function TaskVerticalLine({ task }) {
  const { editedTaskId } = useContext(TasksContext);

  return <InnerTaskVerticalLine {...{ task, editedTaskId }} />;
}
