import React, { useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
}> = ({ rowHeight, tasks, fontFamily, fontSize }) => {
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
            title={t.name}
          >
            {t.name}
            <img className={styles.arrowModal} src={require('../../img/arrow.png')} alt="arrow" />
          </div>
        );
      })}
    </div>
  );
};
