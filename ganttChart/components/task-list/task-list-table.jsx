import React from "react";
import styles from "./task-list-table.module.css";

export const TaskListTableDefault = ({ rowHeight, tasks, fontFamily, fontSize, setMenu, addChild, hideChildren }) => {
  
  const getMargin = level => {
    level -= 1;
    return (level*10)+'px'; 
  }

  const getFontWeight = level => {
    switch(level) {
      case 2 : return 400;
      case 3 : return 300;
      case 4 : return 100;
      default : return 500
    }
  }
  
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        if(!t.show) return null;
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight,  marginLeft: getMargin(t.level), fontWeight: getFontWeight(t.level)}}
            key={`${t.id}row`}
            title={t.name}
          >
            {t.children && t.children[0] ? 
              <div className={styles.arrowRow}
                onClick={hideChildren.bind(null, t)}
              >
                <img src="/img/menuArrow.png" alt="arrow" 
                  style={{transform: t.menu ? 'rotate(0deg)' : 'rotate(180deg)'}}
                />
                {t.name}
              </div>
            : t.name}
            <div className={styles.taskListTableRowImg}>
              {t.level < 4 && <img src="/img/plus.png" alt="add"
                onClick={addChild.bind(null, t)}
              />}
              <img className={styles.arrowModal} src="/img/arrow.png" alt="arrow" 
                onClick={setMenu.bind(null, t, true)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
