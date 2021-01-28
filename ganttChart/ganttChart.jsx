import React, { useEffect, useReducer, useState } from "react";
import { Gantt } from "./components/gantt/gantt";
import { ViewMode } from "./types/public-types";
import { TaskMenu } from "./components/taskMenu/taskMenu";
import { initialState, reducer } from "./store/reducer";
import { addTask, changeTask, delTask, setTaskMenu } from "./store/actions";

//Init
const App = ({ chart, setChart, load, view }) => {
  const [isChecked, setIsChecked] = React.useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (chart[0]) dispatch({ type: "INIT", tasks: chart });
    else dispatch(addTask("Новая задача"));
  }, []);

  useEffect(() => {
    setChart(state.tasks);
  }, [state.tasks]);

  useEffect(() => {
    if (load && load[0]) dispatch({ type: "INIT", tasks: load });
  }, [load]);

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  let onTaskChange = (task) => dispatch(changeTask(task));
  let onTaskDelete = (task) => {};
  let onProgressChange = async (task) => {};
  let onDblClick = (task) => {};
  let onSelect = (task, isSelected) => {};

  const addChild = ({ ...task }) => {
    const tasks = [...state.tasks];
    const i = tasks.findIndex((k) => k.id === task.id);
    const id = Date.now();
    tasks.splice(i + 1, 0, {
      level: task.level === 3 ? 4 : task.level + 1,
      start: task.start,
      end: task.end,
      name: task.level === 3 ? "Подзадача 4" : "Подзадача " + (task.level + 1),
      id,
      progress: 10,
      parent: task.id,
      styles: { progressColor: "#AF78FF", progressSelectedColor: "#ff9e0d" },
      children: [],
      show: true,
    });
    tasks[i].children.push(id);
    dispatch({ type: "INIT", tasks });
  };

  const hideChildren = (task) => {
    task.menu = task.menu ? false : true;
    const tasks = [...state.tasks];
    tasks.forEach((k) => {
      if (task.children.indexOf(k.id) !== -1) {
        k.show = k.show ? false : true;
        if (k.children && k.children[0]) hideArr(tasks, k.children, k.show);
      }
    });
    dispatch({ type: "INIT", tasks });
  };

  const hideArr = (tasks, arr, show) => {
    for (let i = 0; i < arr.length; i++) {
      let item = tasks.findIndex((t) => t.id === arr[i]);
      if (item) tasks[item].show = show;
      if (item && tasks[item].children && tasks[item].children[0])
        hideArr(tasks, tasks[item].children);
    }
  };

  const [list, setList] = useState(1);

  const moveChild = (task, dir) => {
    let tasks = [...state.tasks];
    const i = state.tasks.findIndex((k) => k.id === task.id);
    if (i + dir < 0) return;
    const ney = state.tasks[i + dir];
    if (!ney) return;
    if (ney.parent !== task.parent) return;
    tasks = tasks.filter((k) => k.id !== task.id);
    if (dir > 0) {
      tasks.splice(i + 1, 0, task);
    } else {
      tasks.splice(i - 1, 0, task);
    }
    dispatch({ type: "INIT", tasks });
  };

  if (!state.tasks[0]) return null;
  return (
    <>
      <TaskMenu
        menu={state.menu}
        currentTask={state.currentTask}
        setMenu={(task, menu) => dispatch(setTaskMenu(task, menu))}
        onTaskChange={onTaskChange}
        delTask={(id) => dispatch(delTask(id))}
        moveChild={moveChild}
      />
      <Gantt
        list={list}
        setMenu={(task, menu) => dispatch(setTaskMenu(task, menu))}
        menu={state.menu}
        addTask={(name) => dispatch(addTask(name))}
        tasks={[...state.tasks].filter((k) => k.show)}
        viewMode={view}
        onDateChange={onTaskChange}
        onTaskDelete={onTaskDelete}
        onProgressChange={onProgressChange}
        onDoubleClick={onDblClick}
        onSelect={onSelect}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
        addChild={addChild}
        hideChildren={hideChildren}
      />
    </>
  );
};

export default App;
