import { useContext } from "react";
import styles from "@/styles/tasks.module.scss";
import { Draggable } from "react-beautiful-dnd";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

const taskOffsetLeft = 14;

export default function TaskWrapper({
  children,
  task,
  setUpdatingState,
  arrow,
  plus,
  pencil,
  index,
  taskDepth,
}) {
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const isUserOwnProject = () => projectByQueryId.owner == userCtx._id;

  const startUpdate = (e) => {
    if (
      isUserOwnProject() &&
      ![arrow.current, plus.current, pencil.current].includes(e.target)
    ) {
      setUpdatingState(true);
    }
  };

  return (
    <div
      className={`${styles.task} task task-${task._id}`}
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
