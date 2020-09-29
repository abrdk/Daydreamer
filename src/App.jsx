import React, { useEffect, useReducer } from "react";
import './App.css';
import { ViewSwitcher } from "./components/viewSwitcher/viewSwitcher";
import { Gantt } from "./components/gantt/gantt";
import { ViewMode } from "./types/public-types";
import { TaskMenu } from './components/taskMenu/taskMenu'
import { initialState, reducer } from "./store/reducer";
import { addTask, changeTask, delTask, setTaskMenu } from "./store/actions";

//Init
const App = () => {
  const [view, setView] = React.useState(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let tasks = localStorage.getItem('gantt');
    tasks = JSON.parse(tasks);
    if(localStorage.getItem('gantt') && tasks[0]) {
      for(let i = 0; i < tasks.length; i++) {
        tasks[i].start = new Date(tasks[i].start);
        tasks[i].end = new Date(tasks[i].end);
      }
      dispatch({ type: 'INIT', tasks });
  }
    else dispatch(addTask('Новая задача'))
  }, []);

  useEffect(() => {
    localStorage.setItem('gantt', JSON.stringify(state.tasks));
  }, [state.tasks]);

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  let onTaskChange = task => dispatch(changeTask(task));
  let onTaskDelete = task => {};
  let onProgressChange = async task=> {};
  let onDblClick = task => {};
  let onSelect = (task, isSelected) => {};
  
  if(!state.tasks[0]) return null;
  return (
    <>
      <TaskMenu 
        menu={state.menu}
        currentTask={state.currentTask}
        setMenu={(task, menu) => dispatch(setTaskMenu(task, menu))}
        onTaskChange={onTaskChange}
        delTask={id => dispatch(delTask(id))}
      />
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt
        setMenu={(task, menu) => dispatch(setTaskMenu(task, menu))}
        menu={state.menu}
        addTask={name => dispatch(addTask(name))}
        tasks={state.tasks}
        viewMode={view}
        onDateChange={onTaskChange}
        onTaskDelete={onTaskDelete}
        onProgressChange={onProgressChange}
        onDoubleClick={onDblClick}
        onSelect={onSelect}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
    </>
  );
};

export default App;