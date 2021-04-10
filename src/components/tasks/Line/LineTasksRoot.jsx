import { useContext } from "react";

import LineTask from "@/src/components/tasks/Line/LineTask";

import { TasksContext } from "@/src/context/TasksContext";

export default function LineTasksRoot({ root, calendarStartDate }) {
  const { tasksByProjectId } = useContext(TasksContext);

  const sortedTasksComponents = tasksByProjectId
    .filter((t) => t.root == root)
    .sort((task1, task2) => task1.order > task2.order)
    .map((t) => (
      <LineTask key={t._id} task={t} calendarStartDate={calendarStartDate} />
    ));

  return sortedTasksComponents;
}
