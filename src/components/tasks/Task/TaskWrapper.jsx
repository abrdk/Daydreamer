import { useContext, memo } from "react";
import styles from "@/styles/tasks.module.scss";
import { Draggable } from "react-beautiful-dnd";

import { ProjectsContext } from "@/src/context/ProjectsContext";

const taskOffsetLeft = 14;

function InnerTaskWrapper({
  children,
  setUpdatingState,
  arrow,
  plus,
  pencil,
  index,
  taskDepth,
  task,
  isUserOwnsProject,
}) {
  const startUpdate = (e) => {
    if (
      isUserOwnsProject &&
      ![arrow.current, plus.current, pencil.current].includes(e.target)
    ) {
      setUpdatingState(true);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? styles.draggedTask : ""}
        >
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
        </div>
      )}
    </Draggable>
  );
}

InnerTaskWrapper = memo(InnerTaskWrapper);

export default function TaskWrapper({
  children,
  setUpdatingState,
  arrow,
  plus,
  pencil,
  index,
  taskDepth,
  task,
}) {
  const { isUserOwnsProject } = useContext(ProjectsContext);

  return (
    <InnerTaskWrapper
      {...{
        children,
        setUpdatingState,
        arrow,
        plus,
        pencil,
        index,
        taskDepth,
        task,
        isUserOwnsProject,
      }}
    />
  );
}
