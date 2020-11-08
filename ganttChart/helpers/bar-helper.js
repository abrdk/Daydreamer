
export const convertToBarTasks = (
  tasks,
  dates,
  columnWidth,
  rowHeight,
  barFill,
  barCornerRadius,
  handleWidth,
  barProgressColor,
  barProgressSelectedColor,
  barBackgroundColor,
  barBackgroundSelectedColor
) => {
  const dateDelta =
    dates[1].getTime() -
    dates[0].getTime() -
    dates[1].getTimezoneOffset() * 60 * 1000 +
    dates[0].getTimezoneOffset() * 60 * 1000;
  const taskHeight = (rowHeight * barFill) / 100;

  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
      dates,
      dateDelta,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor
    );
  });

  // set dependencies
  barTasks = barTasks.map((task, i) => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(i);
    }
    return task;
  });

  return barTasks;
};

export const convertToBarTask = (
  task,
  index,
  dates,
  dateDelta,
  columnWidth,
  rowHeight,
  taskHeight,
  barCornerRadius,
  handleWidth,
  barProgressColor,
  barProgressSelectedColor,
  barBackgroundColor,
  barBackgroundSelectedColor
) => {
  const x1 = taskXCoordinate(task.start, dates, dateDelta, columnWidth);
  const x2 = taskXCoordinate(task.end, dates, dateDelta, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    x1,
    x2,
    y,
    index,
    barCornerRadius,
    handleWidth,
    height: taskHeight,
    barChildren: [],
    styles,
  };
};

export const taskXCoordinate = (
  xDate,
  dates,
  dateDelta,
  columnWidth
) => {
  if(typeof xDate === 'string') xDate = new Date(xDate);
  for(let i = 0; i < dates.length; i ++) if(typeof dates[i] === 'string') dates[i] = new Date(dates[i]);
  const index = ~~(
    (xDate.getTime() -
      dates[0].getTime() +
      xDate.getTimezoneOffset() -
      dates[0].getTimezoneOffset()) /
    dateDelta
  );
  const x = Math.round(
    (index +
      (xDate.getTime() -
        dates[index].getTime() -
        xDate.getTimezoneOffset() * 60 * 1000 +
        dates[index].getTimezoneOffset() * 60 * 1000) /
        dateDelta) *
      columnWidth
  );
  return x;
};

export const taskYCoordinate = (
  index,
  rowHeight,
  taskHeight
) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1,
  taskX2,
  progress
) => {
  return (taskX2 - taskX1) * progress * 0.01;
};

export const progressByProgressWidth = (
  progressWidth,
  barTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else {
    return progressPercent;
  }
};

export const progressByX = (x, task) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progressX,
  taskY,
  taskHeight
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(",");
};

export const startByX = (x, xStep, task) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

export const endByX = (x, xStep, task) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

export const moveByX = (x, xStep, task) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

export const dateByX = (
  x,
  taskX,
  taskDate,
  xStep,
  timeStep
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX,
  action,
  selectedTask,
  xStep,
  timeStep,
  initEventX1Delta
) => {
  const changedTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "progress":
      changedTask.progress = progressByX(svgX, selectedTask);
      isChanged = changedTask.progress !== selectedTask.progress;
      break;
    case "start": {
      const newX1 = startByX(svgX, xStep, selectedTask);
      changedTask.x1 = newX1;
      isChanged = changedTask.x1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
      }
      break;
    }
    case "end": {
      const newX2 = endByX(svgX, xStep, selectedTask);
      changedTask.x2 = newX2;
      isChanged = changedTask.x2 !== selectedTask.x2;
      if (isChanged) {
        changedTask.end = dateByX(
          newX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
      }
      break;
    }
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};
