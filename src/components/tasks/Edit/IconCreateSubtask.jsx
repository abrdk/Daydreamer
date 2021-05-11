import React, { useContext, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusSvg from "@/src/components/svg/PlusSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerIconCreateSubtask({
  task,
  numOfSubtasks,
  setEditedTaskId,
  setWhereEditNewTask,
  updateIsOpened,
  createTask,
  isUserOwnsProject,
}) {
  const createSubtask = () => {
    const order = numOfSubtasks;
    const newSubtaskId = nanoid();
    setTimeout(() => setEditedTaskId(newSubtaskId), 100);
    setWhereEditNewTask("edit");
    updateIsOpened({ _id: task._id, isOpened: true });
    createTask({
      ...task,
      _id: newSubtaskId,
      name: "",
      description: "",
      root: task._id,
      order,
    });
  };

  return (
    <When condition={isUserOwnsProject}>
      <div className={styles.addSubtaskWrapper} onClick={createSubtask}>
        <PlusSvg />
      </div>
    </When>
  );
}

InnerIconCreateSubtask = memo(
  InnerIconCreateSubtask,
  (prevProps, nextProps) => {
    for (let key in prevProps.task) {
      if (prevProps.task[key] != nextProps.task[key]) {
        return false;
      }
    }

    return (
      prevProps.numOfSubtasks == nextProps.numOfSubtasks &&
      prevProps.isUserOwnsProject == nextProps.isUserOwnsProject
    );
  }
);

export default function IconCreateSubtask({ task }) {
  const {
    createTask,
    tasksByProjectId,
    setWhereEditNewTask,
    setEditedTaskId,
    updateIsOpened,
  } = useContext(TasksContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const subtasks = tasksByProjectId
    .filter((t) => t.root == task._id)
    .sort((task1, task2) => (task1.order > task2.order ? 1 : -1));

  return (
    <InnerIconCreateSubtask
      {...{
        task,
        numOfSubtasks: subtasks.length,
        setEditedTaskId,
        setWhereEditNewTask,
        updateIsOpened,
        createTask,
        isUserOwnsProject,
      }}
    />
  );
}
