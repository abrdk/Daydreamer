import { useContext, memo } from "react";
import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { nanoid } from "nanoid";

import PlusSvg from "@/src/components/svg/PlusSvg";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

function InnerNewSubtaskIcon({
  editedTaskId,
  isUserOwnsProject,
  task,
  subtasks,
  plusRef,
  createTask,
  updateIsOpened,
  setWhereEditNewTask,
  setEditedTaskId,
}) {
  const createSubtask = (e) => {
    e.stopPropagation();

    const order = subtasks.length ? subtasks[subtasks.length - 1].order + 1 : 0;
    const newTaskId = nanoid();

    updateIsOpened({ _id: task._id, isOpened: true });

    if (editedTaskId) {
      setTimeout(() => setEditedTaskId(newTaskId), 100);
      setWhereEditNewTask("edit");
    } else {
      setWhereEditNewTask("menu");
    }

    createTask({
      ...task,
      _id: newTaskId,
      name: "",
      description: "",
      root: task._id,
      order,
    });
  };

  return (
    <When condition={isUserOwnsProject}>
      <div ref={plusRef} className={styles.plus} onClick={createSubtask}>
        <PlusSvg />
      </div>
    </When>
  );
}

InnerNewSubtaskIcon = memo(
  InnerNewSubtaskIcon,
  (prevProps, nextProps) =>
    prevProps.editedTaskId == nextProps.editedTaskId &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.subtasks.length == nextProps.subtasks.length &&
    prevProps.task.color == nextProps.task.color &&
    prevProps.task.dateStart == nextProps.task.dateStart &&
    prevProps.task.dateEnd == nextProps.task.dateEnd
);

export default function NewSubtaskIcon({ task, plusRef }) {
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const {
    createTask,
    tasksByProjectId,
    updateIsOpened,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
  } = useContext(TasksContext);

  const subtasks = tasksByProjectId
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  return (
    <InnerNewSubtaskIcon
      {...{
        editedTaskId,
        isUserOwnsProject,
        task,
        subtasks,
        plusRef,
        createTask,
        updateIsOpened,
        setWhereEditNewTask,
        setEditedTaskId,
      }}
    />
  );
}
