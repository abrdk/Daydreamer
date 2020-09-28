import React, { useEffect, useRef, useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

export type TaskListProps = {
  addTask: (name: string) => void
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  tasks: Task[];
  horizontalContainerClass?: string;
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
  }>;
};

export const TaskList: React.FC<TaskListProps> = ({
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
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
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
  };

  const [add, setAdd] = useState(false);
  const [name, setName] = useState('');

  const pushTask = (e: any) => {
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
              onKeyDown={(e: any) => {
                e.stopPropagation();
                if(e.keyCode === 13) pushTask(e.target.value);
              }}
              onChange={(e: any) => setName(e.target.value)}
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
