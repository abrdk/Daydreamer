import React, { useState } from "react";
import './App.css';
import { ViewSwitcher } from "./components/viewSwitcher/viewSwitcher";
import { Gantt } from "./components/gantt/gantt";
import { ViewMode } from "./types/public-types";
import { Task } from "./types/public-types";
import { tasksList } from "./helpers/tasks";
import { PopUpMenu } from "./components/popUpMenu/popUpMenu";

//Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);
  const [tasks, setTasks] = useState(tasksList);
  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  let onTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
  };

  let onTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    return conf;
  };

  let onProgressChange = async (task: Task) => {
    await sleep(5000);
    console.log("On progress change Id:" + task.id);
  };

  let onDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  let onSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const addTask = (name: string) => {
    const date = new Date();
    setTasks(prev => ( [...prev, {
      start: date,
      end: new Date(Date.now() + ( 3600 * 1000 * 24 * 7)),
      name,
      id: name+tasks.length,
      progress: 10,
      // dependencies: ["Task 4"],
      styles: { progressColor: "#AF78FF", progressSelectedColor: "#ff9e0d" },
    },] ))
  }

  return (
    <>
      {/* <PopUpMenu /> */}
      <ViewSwitcher
        onViewModeChange={(viewMode: any) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt
        addTask={addTask}
        tasks={tasks}
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