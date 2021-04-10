import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { memo, useContext } from "react";

import { TasksContext } from "@/src/context/TasksContext";

function TasksDraggableWrapper({ children }) {
  const {
    tasksByProjectId,
    isTaskOpened,
    updateTask,
    updateIsOpened,
  } = useContext(TasksContext);

  const findSubtasksIds = (_id) =>
    tasksByProjectId
      .filter((t) => t.root == _id)
      .sort((task1, task2) => task1.order > task2.order)
      .map((t) => [t._id, ...findSubtasksIds(t._id)]);
  const findTaskWithSubtaskIds = (_id) => [_id, ...findSubtasksIds(_id)];

  const sortedTasksIds = tasksByProjectId
    .filter((t) => t.root == "")
    .sort((task1, task2) => task1.order > task2.order)
    .map((t) => findTaskWithSubtaskIds(t._id).flat())
    .flat();

  const getTaskIndex = (_id) => {
    let index = 0;
    for (let currentId of sortedTasksIds) {
      if (currentId == _id) {
        return index;
      }
      const currentTask = tasksByProjectId.find((t) => t._id == currentId);
      if (currentTask && !currentTask.root) {
        index += 1;
      } else if (currentTask) {
        const rootOfCurrentTask = tasksByProjectId.find(
          (t) => t._id == currentTask.root
        );
        if (isTaskOpened[rootOfCurrentTask._id]) {
          index += 1;
        }
      }
    }
    return index;
  };

  const getSourсeAndDestTask = (sourceIndex, destIndex) => {
    const isTaskVisible = (t) => {
      if (t.root == "") {
        return true;
      }
      let currentTask = t;
      while (currentTask) {
        currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
        if (currentTask && isTaskOpened[currentTask._id]) {
          return true;
        }
      }
      return false;
    };

    let sourceTask;
    let destinationTask;

    tasksByProjectId.forEach((t) => {
      if (isTaskVisible(t)) {
        const taskIndex = getTaskIndex(t._id);
        if (taskIndex == sourceIndex && !sourceTask) {
          sourceTask = t;
        }
        if (taskIndex == destIndex && !destinationTask) {
          destinationTask = t;
        }
      }
    });
    return [sourceTask, destinationTask];
  };

  const replaceTasksAtSameRoot = (sourceTask, destinationTask) => {
    const sortedTasks = tasksByProjectId
      .filter((task) => task.root == sourceTask.root)
      .sort((task1, task2) => task1.order > task2.order);

    if (destinationTask.order > sourceTask.order) {
      sortedTasks
        .slice(sourceTask.order + 1, destinationTask.order + 1)
        .forEach((t) => {
          updateTask({ ...t, order: t.order - 1 });
        });
    } else {
      sortedTasks
        .slice(destinationTask.order, sourceTask.order)
        .forEach((t) => {
          updateTask({ ...t, order: t.order + 1 });
        });
    }
    updateTask({ ...sourceTask, order: destinationTask.order });
  };

  const makeSourceTaskFirstInDest = (sourceTask, destinationTask) => {
    const sortedTasksBySourceRoot = tasksByProjectId
      .filter((task) => task.root == sourceTask.root)
      .sort((task1, task2) => task1.order > task2.order);

    const sortedTasksByDestRoot = tasksByProjectId
      .filter((task) => task.root == destinationTask._id)
      .sort((task1, task2) => task1.order > task2.order);

    sortedTasksBySourceRoot.slice(sourceTask.order + 1).forEach((t) => {
      updateTask({ ...t, order: t.order - 1 });
    });

    sortedTasksByDestRoot.slice(0).forEach((t) => {
      updateTask({ ...t, order: t.order + 1 });
    });

    updateTask({ ...sourceTask, order: 0, root: destinationTask._id });
  };

  const replaceTasksAtDifferentRoot = (sourceTask, destinationTask) => {
    const sortedTasksBySourceRoot = tasksByProjectId
      .filter((task) => task.root == sourceTask.root)
      .sort((task1, task2) => task1.order > task2.order);

    const sortedTasksByDestRoot = tasksByProjectId
      .filter((task) => task.root == destinationTask.root)
      .sort((task1, task2) => task1.order > task2.order);

    sortedTasksBySourceRoot.slice(sourceTask.order + 1).forEach((t) => {
      updateTask({ ...t, order: t.order - 1 });
    });

    if (getTaskIndex(destinationTask._id) < getTaskIndex(sourceTask._id)) {
      sortedTasksByDestRoot.slice(destinationTask.order).forEach((t) => {
        updateTask({ ...t, order: t.order + 1 });
      });

      updateTask({
        ...sourceTask,
        order: destinationTask.order,
        root: destinationTask.root,
      });
    } else {
      sortedTasksByDestRoot.slice(destinationTask.order + 1).forEach((t) => {
        updateTask({ ...t, order: t.order + 1 });
      });

      updateTask({
        ...sourceTask,
        order: destinationTask.order + 1,
        root: destinationTask.root,
      });
    }
  };

  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        try {
          const [sourceTask, destinationTask] = getSourсeAndDestTask(
            source.index,
            destination.index
          );

          if (sourceTask.root == destinationTask.root) {
            if (
              isTaskOpened[destinationTask._id] &&
              getTaskIndex(destinationTask._id) > getTaskIndex(sourceTask._id)
            ) {
              makeSourceTaskFirstInDest(sourceTask, destinationTask);
            } else {
              replaceTasksAtSameRoot(sourceTask, destinationTask);
            }
          } else {
            replaceTasksAtDifferentRoot(sourceTask, destinationTask);
          }
        } catch (e) {}
      }}
      onBeforeCapture={({ draggableId }) => {
        updateIsOpened({ _id: draggableId, isOpened: false });
      }}
    >
      <Droppable droppableId="tasks">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
export default memo(TasksDraggableWrapper);
