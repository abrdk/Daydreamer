import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import DraggedTask from "@/src/components/tasks/Task/DraggedTask";
import VerticalLine from "@/src/components/tasks/Task/VerticalLine";
import SubtasksArrow from "@/src/components/tasks/Task/SubtasksArrow";
import Name from "@/src/components/tasks/Task/Name";
import Pencil from "@/src/components/tasks/Task/Pencil";
import Plus from "@/src/components/tasks/Task/Plus";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

const taskHeight = 55;

export default function Task({
  task,
  setContainerHeight,
  editedTask,
  setEditedTask,
}) {
  const userCtx = useContext(UsersContext);
  const { projectByQueryId } = useContext(ProjectsContext);
  const { tasksByProjectId } = useContext(TasksContext);

  const sortedTasks = tasksByProjectId
    .filter((t) => t.root == task.root)
    .sort((task1, task2) => task1.order > task2.order);

  const subtasks = tasksByProjectId
    .filter((subtask) => subtask.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);
  const [isUpdating, setUpdatingState] = useState(!task.name);

  const getContainerHeight = () =>
    document.querySelectorAll(".task").length * taskHeight;

  const isUserOwnProject = () => projectByQueryId.owner == userCtx._id;

  const startUpdateHandler = (e) => {
    if (
      isUserOwnProject() &&
      e.target != arrow.current &&
      e.target != plus.current &&
      e.target != pencil.current
    ) {
      setUpdatingState(true);
    }
  };

  useEffect(() => {
    setContainerHeight(getContainerHeight());
  }, [tasksByProjectId, task.isOpened]);

  return (
    <>
      <DraggedTask
        task={task}
        editedTask={editedTask}
        subtasks={subtasks}
        startUpdateHandler={startUpdateHandler}
        sortedTasks={sortedTasks}
      >
        <VerticalLine task={task} editedTask={editedTask} />

        <SubtasksArrow task={task} arrow={arrow} />

        <Name
          task={task}
          isUpdating={isUpdating}
          setUpdatingState={setUpdatingState}
          fakeTextRef={fakeText}
        />

        <Pencil
          task={task}
          fakeTextRef={fakeText}
          pencilRef={pencil}
          isUpdating={isUpdating}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
        />

        <Plus task={task} plusRef={plus} />
      </DraggedTask>

      <When condition={subtasks.length && task.isOpened}>
        <div className={styles.subtasksWrapper}>
          <TasksRoot
            root={task._id}
            setContainerHeight={setContainerHeight}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
          />
        </div>
      </When>
    </>
  );
}
