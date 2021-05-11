import { useContext, memo } from "react";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/TasksContext";

function InnerTasksRoot({ setContainerHeight, indexesWithIds }) {
  let tasksComponents = [];

  for (let _id in indexesWithIds) {
    tasksComponents.push(
      <Task
        key={_id}
        index={indexesWithIds[_id]}
        taskId={_id}
        setContainerHeight={setContainerHeight}
      />
    );
  }

  return tasksComponents;
}

InnerTasksRoot = memo(InnerTasksRoot, (prevProps, nextProps) => {
  if (
    Object.keys(prevProps.indexesWithIds).length !=
    Object.keys(nextProps.indexesWithIds).length
  ) {
    return false;
  }

  for (const _id in prevProps.indexesWithIds) {
    try {
      if (prevProps.indexesWithIds[_id] != nextProps.indexesWithIds[_id]) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return true;
});

export default function TasksRoot({ root, setContainerHeight }) {
  const { tasksByProjectId, isTaskOpened } = useContext(TasksContext);

  const findSubtasksIds = (_id) =>
    tasksByProjectId
      .filter((t) => t.root == _id)
      .sort((task1, task2) => (task1.order > task2.order ? 1 : -1))
      .map((t) => [t._id, ...findSubtasksIds(t._id)]);
  const findTaskWithSubtaskIds = (_id) => [_id, ...findSubtasksIds(_id)];

  const sortedTasksIds = tasksByProjectId
    .filter((t) => t.root == "")
    .sort((task1, task2) => (task1.order > task2.order ? 1 : -1))
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

  const sortedTasks = tasksByProjectId
    .filter((task) => task.root == root)
    .sort((task1, task2) => (task1.order > task2.order ? 1 : -1));

  let indexesWithIds = {};
  sortedTasks.forEach((t) => {
    indexesWithIds[t._id] = getTaskIndex(t._id);
  });

  return <InnerTasksRoot {...{ setContainerHeight, indexesWithIds }} />;
}
