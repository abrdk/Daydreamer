import { useContext } from "react";

import LineTask from "@/src/components/tasks/Line/LineTask";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTasksRoot({
  root,
  setMenu,
  editedTask,
  setEditedTask,
  view,
  calendarStartDate,
}) {
  const { tasksByProjectId, sortedTasksIds } = useContext(TasksContext);

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
        if (rootOfCurrentTask.isOpened) {
          index += 1;
        }
      }
    }
    return index;
  };

  const sortedTasksComponents = tasksByProjectId
    .filter((t) => t.root == root)
    .sort((task1, task2) => task1.order > task2.order)
    .map((t, i) => (
      <LineTask
        key={t._id}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        setMenu={setMenu}
        task={t}
        index={getTaskIndex(t._id)}
        view={view}
        calendarStartDate={calendarStartDate}
      />
    ));

  return sortedTasksComponents;
}
