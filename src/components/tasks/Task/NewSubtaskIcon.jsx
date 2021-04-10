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
  numOfSubtasks,
  plusRef,
  createTask,
  updateIsOpened,
  setWhereEditNewTask,
  setEditedTaskId,
}) {
  const createSubtask = (e) => {
    e.stopPropagation();

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
      order: numOfSubtasks,
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

InnerNewSubtaskIcon = memo(InnerNewSubtaskIcon, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.editedTaskId == nextProps.editedTaskId &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.numOfSubtasks == nextProps.numOfSubtasks
  );
});

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
        numOfSubtasks: subtasks.length,
        plusRef,
        createTask,
        updateIsOpened,
        setWhereEditNewTask,
        setEditedTaskId,
      }}
    />
  );
}
