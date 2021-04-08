import { useState, useContext, useEffect, useRef, useMemo, memo } from "react";
import { When } from "react-if";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import TaskWrapper from "@/src/components/tasks/Task/TaskWrapper";
import TaskVerticalLine from "@/src/components/tasks/Task/TaskVerticalLine";
import SubtasksArrow from "@/src/components/tasks/Task/SubtasksArrow";
import TaskName from "@/src/components/tasks/Task/TaskName";
import EditTaskIcon from "@/src/components/tasks/Task/EditTaskIcon";
import NewSubtaskIcon from "@/src/components/tasks/Task/NewSubtaskIcon";

import { TasksContext } from "@/src/context/TasksContext";

const taskHeight = 55;

function InnerTask({
  setContainerHeight,
  index,
  isCurrentTaskOpened,
  whereEditNewTask,
  hasSubtasks,
  task,
  taskDepth,
  numOfTasks,
}) {
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);

  const [isUpdating, setUpdatingState] = useState(false);

  useEffect(() => {
    if (task.name == "" && whereEditNewTask == "menu") {
      setUpdatingState(true);
    }
  }, [task.name]);

  const getContainerHeight = () =>
    document.querySelectorAll(".task").length * taskHeight;

  useEffect(() => {
    setContainerHeight(getContainerHeight());
  }, [isCurrentTaskOpened, numOfTasks]);

  return (
    <>
      <TaskWrapper
        setUpdatingState={setUpdatingState}
        arrow={arrow}
        plus={plus}
        pencil={pencil}
        index={index}
        taskDepth={taskDepth}
        task={task}
      >
        <TaskVerticalLine task={task} />

        <SubtasksArrow
          taskId={task._id}
          hasSubtasks={hasSubtasks}
          arrow={arrow}
          taskDepth={taskDepth}
        />

        <TaskName
          task={task}
          isUpdating={isUpdating}
          setUpdatingState={setUpdatingState}
          fakeTextRef={fakeText}
          taskDepth={taskDepth}
        />

        <EditTaskIcon
          task={task}
          fakeTextRef={fakeText}
          pencilRef={pencil}
          taskDepth={taskDepth}
        />

        <NewSubtaskIcon task={task} plusRef={plus} />
      </TaskWrapper>

      <When condition={hasSubtasks && isCurrentTaskOpened}>
        <TasksRoot root={task._id} setContainerHeight={setContainerHeight} />
      </When>
    </>
  );
}

InnerTask = memo(
  InnerTask,
  (prevProps, nextProps) =>
    prevProps.index == nextProps.index &&
    prevProps.isCurrentTaskOpened == nextProps.isCurrentTaskOpened &&
    prevProps.whereEditNewTask == nextProps.whereEditNewTask &&
    prevProps.hasSubtasks == nextProps.hasSubtasks &&
    prevProps.task.name == nextProps.task.name &&
    prevProps.task.dateStart == nextProps.task.dateStart &&
    prevProps.task.dateEnd == nextProps.task.dateEnd &&
    prevProps.task.color == nextProps.task.color &&
    prevProps.numOfTasks == nextProps.numOfTasks
);

export default function Task({ taskId, setContainerHeight, index }) {
  const { tasksByProjectId, isTaskOpened, whereEditNewTask } = useContext(
    TasksContext
  );

  const task = tasksByProjectId.find((t) => t._id == taskId);

  const subtasks = tasksByProjectId.filter(
    (subtask) => subtask.root == task._id
  );

  const isCurrentTaskOpened = isTaskOpened[taskId];
  const hasSubtasks = subtasks.length > 0;
  const numOfTasks = tasksByProjectId.length;

  let taskDepth = -1;
  let currentTask = task;
  while (currentTask) {
    currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
    taskDepth += 1;
  }

  return (
    <InnerTask
      {...{
        setContainerHeight,
        index,
        isCurrentTaskOpened,
        whereEditNewTask,
        hasSubtasks,
        task,
        taskDepth,
        numOfTasks,
      }}
    />
  );
}
