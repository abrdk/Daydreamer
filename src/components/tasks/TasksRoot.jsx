import { useContext, useState, useEffect, useRef } from "react";
import { When } from "react-if";
import styles from "@/styles/tasks.module.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    setContainerHeight(
      (document.querySelectorAll(".task").length -
        document.querySelectorAll(".clone").length) *
        55
    );
  }, [filteredTasks, isSubtasksOpened]);

  // drag code
  const reorderSubtasksState = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSubtasksState(result);
  };

  const reorderHandler = ({ oldIndex, newIndex }) => {
    if (oldIndex != newIndex) {
      const draggableTask = sortedTasks[oldIndex];
      updateTask({ ...draggableTask, order: newIndex });
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

  const dragEndHandler = (result) => {
    if (!result.destination) {
      return;
    }
    reorderHandler({
      oldIndex: result.source.index,
      newIndex: result.destination.index,
    });
    reorderSubtasksState(
      isSubtasksOpened,
      result.source.index,
      result.destination.index
    );
  };

  const tasksComponents = sortedTasks.map((task, i) => {
    const subTasks = tasks.filter((subTask) => subTask.root == task._id);
    return (
      <Draggable key={task._id} draggableId={task._id} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? styles.dragged : ""}
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
        )}
      </Draggable>
    );
  });

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasksComponents}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
