import React, { useState, useRef, useEffect } from "react";
import { ViewMode } from "../../types/public-types";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { StandardTooltipContent } from "../other/tooltip";
import { Scroll } from "../other/scroll";
import { TaskList } from "../task-list/task-list";
import styles from "./gantt.module.css";
import { TaskGantt } from "./task-gantt";

export const Gantt = ({
  tasks,
  addTask,
  headerHeight = 100,
  columnWidth = 60,
  listCellWidth = "155px",
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  locale = "ru-RU",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Roboto",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  onSelect,
  setMenu,
  addChild,
  hideChildren,
  list,
}) => {
  const wrapperRef = useRef(null);
  const [ganttTasks, setGanttTasks] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const [startDate, endDate] = ganttDateRange(ganttTasks, viewMode);
  const dates = seedDates(startDate, endDate, viewMode);

  const svgHeight = rowHeight * ganttTasks.length;
  const gridWidth = dates.length * columnWidth;
  const ganttFullHeight = ganttTasks.length * rowHeight;

  useEffect(() => {
    setGanttTasks(tasks);
  }, [tasks]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const newScrollY = scrollY + event.deltaY;
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    if (
      wrapperRef.current &&
      ganttHeight &&
      ganttHeight < ganttTasks.length * rowHeight
    ) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [scrollY, ganttHeight, ganttTasks, rowHeight, ganttFullHeight]);

  const handleScrollY = (event) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
    }
    setIgnoreScrollEvent(false);
  };

  const handleScrollX = (event) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
    }
    setIgnoreScrollEvent(false);
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
      default:
        newScrollX += 0;
    }
    if (isX) {
      if (newScrollX < 0) {
        setScrollX(0);
      } else if (newScrollX > gridWidth) {
        setScrollX(gridWidth);
      } else {
        setScrollX(newScrollX);
      }
    } else {
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
    }
    setIgnoreScrollEvent(true);
  };

  // task change event
  const handleTasksChange = (tasks) => {
    setGanttTasks(tasks);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId) => {
    const newSelectedTask = ganttTasks.find((t) => t.id === taskId);
    if (newSelectedTask) {
      if (onSelect) {
        const oldSelectedTask = ganttTasks.find((t) => t.id === selectedTask);
        if (oldSelectedTask) {
          onSelect(oldSelectedTask, false);
        }
        onSelect(newSelectedTask, true);
      }
      setSelectedTask(newSelectedTask.id);
    } else {
      if (onSelect) {
        const oldSelectedTask = ganttTasks.find((t) => t.id === selectedTask);
        if (oldSelectedTask) {
          onSelect(oldSelectedTask, false);
        }
      }
      setSelectedTask("");
    }
  };

  const gridProps = {
    columnWidth,
    gridWidth,
    tasks: ganttTasks,
    rowHeight,
    dates,
    todayColor,
  };
  const calendarProps = {
    dates,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
  };
  const barProps = {
    addTask: addTask,
    tasks: ganttTasks,
    selectedTask,
    setSelectedTask: handleSelectedTask,
    rowHeight,
    barCornerRadius,
    columnWidth,
    dates,
    barFill,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    handleWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgHeight,
    onTasksChange: handleTasksChange,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onTaskDelete,
    TooltipContent,
  };

  const tableProps = {
    addTask,
    rowHeight,
    rowWidth: listCellWidth,
    fontFamily,
    fontSize,
    tasks: ganttTasks,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTaskId: selectedTask,
    setSelectedTask: handleSelectedTask,
    TaskListHeader,
    TaskListTable,
    setMenu,
    addChild,
    hideChildren,
  };

  return (
    <div
      className={styles.wrapper}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={wrapperRef}
    >
      <TaskGantt
        gridProps={gridProps}
        calendarProps={calendarProps}
        barProps={barProps}
        ganttHeight={ganttHeight}
        scrollY={scrollY}
        scrollX={scrollX}
        onScroll={handleScrollX}
        addChild={addChild}
      />

      <Scroll
        ganttFullHeight={ganttFullHeight}
        ganttHeight={ganttHeight}
        headerHeight={headerHeight}
        scroll={scrollY}
        onScroll={handleScrollY}
      />
    </div>
  );
};
