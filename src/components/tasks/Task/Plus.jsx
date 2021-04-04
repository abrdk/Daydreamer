import { useContext } from "react";
import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";
import { nanoid } from "nanoid";

import PlusIcon from "@/src/components/svg/PlusIcon";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Plus({ task, plusRef }) {
  const userCtx = useContext(UsersContext);
  const { projectByQueryId } = useContext(ProjectsContext);
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

  const isUserOwnProject = () => projectByQueryId.owner == userCtx._id;

  const openSubtasksHandler = () => {
    updateIsOpened({ _id: task._id, isOpened: !task.isOpened });
  };

  const createSubtask = (e) => {
    e.stopPropagation();

    const order = subtasks.length ? subtasks[subtasks.length - 1].order + 1 : 0;
    const newTaskId = nanoid();

    if (!task.isOpened) {
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
        <PlusIcon />
      </div>
    </When>
  );
}
