import { useContext, useState, useEffect } from "react";
import { When } from "react-if";
import styles from "@/styles/tasks.module.scss";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksRoot({ root, setContainerHeight }) {
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }
  const { tasks, updateTask } = useContext(TasksContext);
  const filteredTasks = tasks.filter(
    (task) => task.root == root && task.project == currentProject._id
  );
  const sortedTasks = filteredTasks.sort(
    (task1, task2) => task1.order > task2.order
  );

  const [isSubtasksOpened, setSubtasksState] = useState(
    filteredTasks.map(() => false)
  );

  useEffect(() => {
    setContainerHeight(document.querySelectorAll(".task").length * 55);
  }, [filteredTasks, isSubtasksOpened]);

  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const reorderHandler = ({ oldIndex, newIndex }) => {
    if (oldIndex != newIndex) {
      const draggableTask = sortedTasks[oldIndex];
      updateTask({ ...draggableTask, order: newIndex });
      setDraggedTaskIndex(newIndex);
      if (newIndex > oldIndex) {
        sortedTasks.slice(oldIndex + 1, newIndex + 1).forEach((project) => {
          updateTask({ ...project, order: project.order - 1 });
        });
      } else {
        sortedTasks.slice(newIndex, oldIndex).forEach((project) => {
          updateTask({ ...project, order: project.order + 1 });
        });
      }
    }
  };

  const dragStartHandler = (e, oldIndex) => {
    setDraggedTaskIndex(oldIndex);
    e.dataTransfer.effectAllowed = "move";
  };
  const dragOverHandler = (newIndex) => {
    reorderHandler({ oldIndex: draggedTaskIndex, newIndex });
  };
  const dragEndHandler = () => {
    setDraggedTaskIndex(null);
  };

  const tasksComponents = sortedTasks.map((task, i) => {
    const subTasks = tasks.filter((subTask) => subTask.root == task._id);
    return (
      <div
        draggable
        onDragOver={() => dragOverHandler(i)}
        onDragStart={(e) => dragStartHandler(e, i)}
        onDragEnd={dragEndHandler}
        key={task._id}
        // onClick={() => {
        //   reorderHandler({ oldIndex: 5, newIndex: 1 });
        // }}
      >
        <Task
          task={task}
          hasSubtasks={subTasks.length ? true : false}
          isSubtasksOpened={isSubtasksOpened}
          setSubtasksState={setSubtasksState}
        />
        <When condition={subTasks.length && isSubtasksOpened[i]}>
          <div className={styles.subtasksWrapper}>
            <TasksRoot
              root={task._id}
              setContainerHeight={setContainerHeight}
            />
          </div>
        </When>
      </div>
    );
  });

  return <>{tasksComponents}</>;
}
