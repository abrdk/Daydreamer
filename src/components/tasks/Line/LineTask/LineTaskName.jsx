import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useRef, useContext } from "react";
import Truncate from "react-truncate";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { UsersContext } from "@/src/context/users/UsersContext";

export default function LineTaskName({ task, textWidth, taskWidth, inputRef }) {
  const { updateTask, whereEditNewTask, setWhereEditNewTask } = useContext(
    TasksContext
  );
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

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
            isUpdating ? calendarStyles.hiddenName : calendarStyles.name
          }
          onClick={() => {
            if (projectByQueryId.owner == userCtx._id) {
              setIsUpdating(true);
            }
          }}
          style={{
            opacity: task.name == "" && 0.5,
            cursor: projectByQueryId.owner != userCtx._id ? "default" : null,
          }}
          ref={textRef}
        >
          <Truncate lines={1} width={textWidth}>
            {task.name != "" ? task.name : getDefaultName()}
          </Truncate>
        </div>
      </When>
    </>
  );
}
