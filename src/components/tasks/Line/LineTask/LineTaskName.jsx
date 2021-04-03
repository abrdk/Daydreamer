import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
import { useEffect, useState, useRef, useContext } from "react";
import Truncate from "react-truncate";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function LineTaskName({ task, textWidth, taskWidth, inputRef }) {
  const { updateTask } = useContext(TasksContext);

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
    if (isUpdating && inputRef.current) {
      inputRef.current.focus();
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
          onClick={() => setIsUpdating(true)}
          style={{
            opacity: task.name == "" && 0.5,
          }}
          ref={textRef}
        >
          <Truncate lines={1} width={textWidth}>
            {task.name ? task.name : getDefaultName()}
          </Truncate>
        </div>
      </When>
    </>
  );
}
