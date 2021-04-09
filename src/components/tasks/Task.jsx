import { useState, useContext, useEffect, useRef, memo } from "react";
import { When } from "react-if";
import styles from "@/styles/tasks.module.scss";
import { Draggable } from "react-beautiful-dnd";

import TasksRoot from "@/src/components/tasks/TasksRoot";
import TaskVerticalLine from "@/src/components/tasks/Task/TaskVerticalLine";
import SubtasksArrow from "@/src/components/tasks/Task/SubtasksArrow";
import TaskName from "@/src/components/tasks/Task/TaskName";
import EditTaskIcon from "@/src/components/tasks/Task/EditTaskIcon";
import NewSubtaskIcon from "@/src/components/tasks/Task/NewSubtaskIcon";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

const taskHeight = 55;
const taskOffsetLeft = 14;

function InnerTask({
  setContainerHeight,
  index,
  isCurrentTaskOpened,
  whereEditNewTask,
  hasSubtasks,
  task,
  taskDepth,
  numOfTasks,
  isUserOwnsProject,
}) {
  const fakeText = useRef(null);
  const arrow = useRef(null);
  const plus = useRef(null);
  const pencil = useRef(null);
  const taskWrapperRef = useRef(null);

  const [isUpdating, setUpdatingState] = useState(false);

  const startUpdate = (e) => {
    if (e.target == taskWrapperRef.current && isUpdating) {
      setUpdatingState(false);
    } else if (
      isUserOwnsProject &&
      ![arrow.current, plus.current, pencil.current].includes(e.target)
    ) {
      setUpdatingState(true);
    }
  };

  const getContainerHeight = () =>
    document.querySelectorAll(".task").length * taskHeight;

  useEffect(() => {
    if (task.name == "" && whereEditNewTask == "menu") {
      setUpdatingState(true);
    }
  }, [task.name]);

  useEffect(() => {
    setContainerHeight(getContainerHeight());
  }, [isCurrentTaskOpened, numOfTasks]);

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? styles.draggedTask : ""}
          >
            <div
              className={`${styles.task} task`}
              style={{
                paddingLeft: 33 + taskDepth * taskOffsetLeft,
                color: taskDepth > 0 ? "#949da7" : "#696f75",
              }}
              onClick={startUpdate}
              ref={taskWrapperRef}
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
            </div>
          </div>
        )}
      </Draggable>

      <When condition={hasSubtasks && isCurrentTaskOpened}>
        <TasksRoot root={task._id} setContainerHeight={setContainerHeight} />
      </When>
    </>
  );
}

InnerTask = memo(InnerTask, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.index == nextProps.index &&
    prevProps.isCurrentTaskOpened == nextProps.isCurrentTaskOpened &&
    prevProps.whereEditNewTask == nextProps.whereEditNewTask &&
    prevProps.hasSubtasks == nextProps.hasSubtasks &&
    prevProps.numOfTasks == nextProps.numOfTasks &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject
  );
});

export default function Task({ taskId, setContainerHeight, index }) {
  const { tasksByProjectId, isTaskOpened, whereEditNewTask } = useContext(
    TasksContext
  );
  const { isUserOwnsProject } = useContext(ProjectsContext);

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
        isUserOwnsProject,
      }}
    />
  );
}
