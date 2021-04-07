import { useState, useContext, useEffect, useRef } from "react";
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

export default function Task({ task, setContainerHeight, index }) {
  const { tasksByProjectId, isTaskOpened } = useContext(TasksContext);

  const subtasks = tasksByProjectId.filter(
    (subtask) => subtask.root == task._id
  );

  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);

  const [isUpdating, setUpdatingState] = useState(false);

  const getContainerHeight = () =>
    document.querySelectorAll(".task").length * taskHeight;

  useEffect(() => {
    setContainerHeight(getContainerHeight());
  }, [tasksByProjectId, isTaskOpened[task._id]]);

  let taskDepth = -1;
  let currentTask = task;
  while (currentTask) {
    currentTask = tasksByProjectId.find((t) => t._id == currentTask.root);
    taskDepth += 1;
  }

  return (
    <>
      <TaskWrapper
        setUpdatingState={setUpdatingState}
        arrow={arrow}
        plus={plus}
        pencil={pencil}
        index={index}
        taskDepth={taskDepth}
      >
        <TaskVerticalLine task={task} />

        <SubtasksArrow task={task} arrow={arrow} taskDepth={taskDepth} />

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
          isUpdating={isUpdating}
          taskDepth={taskDepth}
        />

        <NewSubtaskIcon task={task} plusRef={plus} />
      </TaskWrapper>

      <When condition={subtasks.length && isTaskOpened[task._id]}>
        <TasksRoot root={task._id} setContainerHeight={setContainerHeight} />
      </When>
    </>
  );
}
