import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";
import Scrollbar from "react-scrollbars-custom";

import LineTask from "@/src/components/tasks/LineTask";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTasksRoot({
  root,
  setMenu,
  editedTask,
  setEditedTask,
  isSubtasksOpened,
  setIsSubtasksOpened,
}) {
  const { tasksByProjectId, sortedTasksIds } = useContext(TasksContext);

  const sortedTasksComponents = useMemo(
    () =>
      tasksByProjectId
        .filter((t) => t.root == root)
        .sort((task1, task2) => task1.order > task2.order)
        .map((t, i) => (
          <LineTask
            key={t._id}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            setMenu={setMenu}
            task={t}
            index={sortedTasksIds.indexOf(t._id)}
            isSubtasksOpened={isSubtasksOpened}
            setIsSubtasksOpened={setIsSubtasksOpened}
          />
        )),
    [tasksByProjectId, sortedTasksIds, isSubtasksOpened]
  );

  return sortedTasksComponents;
}
