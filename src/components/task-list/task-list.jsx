import React, { useEffect, useRef, useState } from "react";
import styles from "./task-list-table.module.css";

export const TaskList = ({
  addTask,
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTaskId,
  setSelectedTask,
  locale,
  ganttHeight,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  setMenu,
  addChild,
  hideChildren
}) => {
  const horizontalContainerRef = useRef(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId,
    setSelectedTask,
    setMenu,
    addChild,
    hideChildren
  };

  const [add, setAdd] = useState(false);
  const [name, setName] = useState('');

  const pushTask = e => {
    if(name) addTask(name);
    setAdd(false);
    setName('');
  }

  return (
    <div className={styles.taskList}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
      <div className={styles.addTask}
        style={{background: add ? '#F5F5FF' : 'none'}}
      >
        {add ?
          <>
            <input type="text" value={name}
              onKeyDown={e => {
                e.stopPropagation();
                if(e.keyCode === 13) pushTask(e.target.value);
              }}
              onChange={e => setName(e.target.value)}
            />
            <img src={require('../../img/enter.png')} alt="enter"
              onClick={pushTask}
            />
          </>
        : <div onClick={() => setAdd(true)}>
          Добавить задачу
        </div>}
      </div>
    </div>
  );
};
