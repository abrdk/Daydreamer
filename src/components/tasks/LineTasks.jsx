import styles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";

import LineTask from "@/src/components/tasks/LineTask";

import { TasksContext } from "@/src//context/tasks/TasksContext";

export default function LineTasks() {
  const { tasksByProjectId } = useContext(TasksContext);

  return (
    <div>
      {tasksByProjectId.map((t, i) => (
        <LineTask task={t} key={t._id} index={i} />
      ))}
    </div>
  );
}
