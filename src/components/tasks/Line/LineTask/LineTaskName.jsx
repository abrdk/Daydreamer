import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useRef, useContext, memo } from "react";
import Truncate from "react-truncate";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerLineTaskName({
  task,
  textWidth,
  taskWidth,
  inputRef,
  updateTask,
  whereEditNewTask,
  setWhereEditNewTask,
  isUserOwnsProject,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [nameState, setNameState] = useState(task.name);
  const [inputWidth, setInputWidth] = useState("100vw");

  const textRef = useRef(null);

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const handleNameUpdate = (e) => {
    setNameState(e.target.value);
    updateTask({ ...task, name: e.target.value });
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
    setInputWidth("100vw");
    setIsUpdating(false);
  };

  const focusOnInput = () => {
    if (
      isUpdating &&
      inputRef.current &&
      (whereEditNewTask == "calendar" || whereEditNewTask == "")
    ) {
      inputRef.current.focus();
      setWhereEditNewTask("");
    }
  };

  useEffect(() => {
    focusOnInput();
  }, [isUpdating, inputRef.current]);

  useEffect(() => {
    if (textRef.current && isUpdating) {
      setInputWidth(textRef.current.clientWidth + 10);
    }
    if (!isUpdating) {
      setNameState(task.name);
    }
  }, [task.name, isUpdating]);

  useEffect(() => {
    if (task.name == "" && whereEditNewTask == "calendar") {
      setIsUpdating(true);
    }
  }, [task.name]);

  return (
    <>
      <When condition={textWidth > 0}>
        <When condition={isUpdating}>
          <input
            value={nameState}
            className={calendarStyles.input}
            ref={inputRef}
            onChange={handleNameUpdate}
            onBlur={handleBlur}
            style={{
              width: inputWidth,
              maxWidth: taskWidth - 36 > 0 && taskWidth - 36,
            }}
          />
        </When>
        <div
          className={
            isUpdating
              ? calendarStyles.hiddenName + " grab"
              : calendarStyles.name + " grab"
          }
          onClick={() => {
            if (isUserOwnsProject && window.innerWidth >= 768) {
              setIsUpdating(true);
            }
          }}
          style={{
            opacity: task.name == "" && 0.5,
            cursor: !isUserOwnsProject ? "default" : "",
          }}
          ref={textRef}
        >
          <div style={{ pointerEvents: "none" }}>
            {/* Don't touch truncate width, otherwise at some width it will not display correctly */}
            <Truncate lines={1} width={textWidth - 0.1}>
              {task.name != "" ? task.name : getDefaultName()}
            </Truncate>
          </div>
        </div>
      </When>
    </>
  );
}

InnerLineTaskName = memo(InnerLineTaskName, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.textWidth == nextProps.textWidth &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.whereEditNewTask == nextProps.whereEditNewTask &&
    prevProps.taskWidth == nextProps.taskWidth
  );
});

export default function LineTaskName(props) {
  const { updateTask, whereEditNewTask, setWhereEditNewTask } = useContext(
    TasksContext
  );
  const { isUserOwnsProject } = useContext(ProjectsContext);
  return (
    <InnerLineTaskName
      {...{
        ...props,
        updateTask,
        whereEditNewTask,
        setWhereEditNewTask,
        isUserOwnsProject,
      }}
    />
  );
}
