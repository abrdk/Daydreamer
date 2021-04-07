import { useContext } from "react";
import styles from "@/styles/tasks.module.scss";
import { Draggable } from "react-beautiful-dnd";

import { ProjectsContext } from "@/src/context/ProjectsContext";

const taskOffsetLeft = 14;

export default function TaskWrapper({
  children,
  setUpdatingState,
  arrow,
  plus,
  pencil,
  index,
  taskDepth,
}) {
  const { isUserOwnsProject } = useContext(ProjectsContext);

  const startUpdate = (e) => {
    if (
      isUserOwnsProject &&
      ![arrow.current, plus.current, pencil.current].includes(e.target)
    ) {
      setUpdatingState(true);
    }
  };

  return (
    <div
      className={`${styles.task} task`}
      style={{
        paddingLeft: 33 + taskDepth * taskOffsetLeft,
        color: taskDepth > 0 ? "#949da7" : "#696f75",
      }}
      onClick={startUpdate}
    >
      {children}
    </div>
  );
}
