import { useContext } from "react";

import LineTask from "@/src/components/tasks/Line/LineTask";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTasksRoot({
  root,
  setMenu,
  setEditedTask,
  view,
  calendarStartDate,
  editedTask,
}) {
  const { tasksByProjectId } = useContext(TasksContext);

  const sortedTasksComponents = tasksByProjectId
    .filter((t) => t.root == root)
    .sort((task1, task2) => task1.order > task2.order)
    .map((t) => (
      <LineTask
        key={t._id}
        setEditedTask={setEditedTask}
        setMenu={setMenu}
        task={t}
        view={view}
        calendarStartDate={calendarStartDate}
        editedTask={editedTask}
      />
    ));

  return sortedTasksComponents;
}
