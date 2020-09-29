import React from "react";
import styles from "./task-list-table.module.css";

export const TaskListTableDefault = ({ rowHeight, tasks, fontFamily, fontSize, setMenu }) => {
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
            <img className={styles.arrowModal} src={require('../../img/arrow.png')} alt="arrow" 
              onClick={setMenu.bind(null, t, true)}
            />
          </div>
        );
      })}
    </div>
  );
};
