import { useContext } from "react";
import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { nanoid } from "nanoid";

import PlusSvg from "@/src/components/svg/PlusSvg";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function Plus({ task, plusRef }) {
  const { user } = useContext(UsersContext);
  const { projectByQueryId } = useContext(ProjectsContext);
  const {
    createTask,
    tasksByProjectId,
    updateIsOpened,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
    isTaskOpened,
  } = useContext(TasksContext);

  const subtasks = tasksByProjectId
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  const isUserOwnProject = () => projectByQueryId.owner == user._id;

  const openSubtasksHandler = () => {
    updateIsOpened({ _id: task._id, isOpened: !isTaskOpened[task._id] });
  };

  const createSubtask = (e) => {
    e.stopPropagation();

    const order = subtasks.length ? subtasks[subtasks.length - 1].order + 1 : 0;
    const newTaskId = nanoid();

    if (!isTaskOpened[task._id]) {
      openSubtasksHandler();
    }

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
    <When condition={isUserOwnProject()}>
      <div ref={plusRef} className={styles.plus} onClick={createSubtask}>
        <PlusSvg />
      </div>
    </When>
  );
}
