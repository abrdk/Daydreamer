import { useContext, useState, useEffect, useRef } from "react";
import styles from "@/styles/taskEdit.module.scss";
import Scrollbar from "react-scrollbars-custom";
import FloatingLabel from "floating-label-react";
import usePrevious from "@react-hook/previous";
import { When } from "react-if";

import TaskCalendar from "@/src/components/tasks/TaskCalendar";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksEdit({ taskId, setEditedTask }) {
  const { projects } = useContext(ProjectsContext);

  const { tasks, updateTask, deleteTask } = useContext(TasksContext);
  const task = tasks.find((t) => t._id == taskId);

  const fakeText = useRef(null);
  const textArea = useRef(null);

  const [editedName, setEditedName] = useState(() => (task ? task.name : ""));
  const [editedDescription, setEditedDescription] = useState(() =>
    task ? task.description : ""
  );
  const prevDescription = usePrevious(editedDescription);
  const [isTextareaFocused, setTextareaFocused] = useState(false);

  const nameUpdateHandler = (e) => {
    if (e.target.value.length <= 100) {
      updateTask({ ...task, name: e.target.value });
      setEditedName(e.target.value);
    }
  };
  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;
  const setDefaultName = (e) => {
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
  };

  const descriptionUpdateHandler = (e) => {
    updateTask({ ...task, description: e.target.value });
    setEditedDescription(e.target.value);
  };

  const colorUpdateHandler = (color) => {
    updateTask({ ...task, color });
  };

  const deleteHandler = () => {
    tasks
      .filter((t) => t.root == task.root)
      .slice(task.order + 1)
      .forEach((t) => {
        updateTask({ ...t, order: t.order - 1 });
      });
    deleteTask(taskId);
  };

  useEffect(() => {
    if (task) {
      setEditedName(task.name);
      setEditedDescription(task.description);
    }
  }, [task]);

  useEffect(() => {
    if (fakeText.current) {
      textArea.current.style.height = fakeText.current.clientHeight + "px";
    }
  }, [editedDescription]);

  if (task) {
    const colorsElements = [
      "258EFA",
      "FFBC42",
      "59CD90",
      "D06BF3",
      "66CEDC",
      "FF5B79",
    ].map((color) => (
      <div
        key={color}
        className={task.color == color ? styles.colorPicked : styles.color}
        style={{
          background: `#${color}`,
          border: task.color == color ? `1px solid #${color}` : 0,
        }}
        onClick={() => colorUpdateHandler(color)}
      >
        <When condition={task.color == color}>
          <div
            className={styles.colorInner}
            style={{ background: `#${color}` }}
          ></div>
        </When>
      </div>
    ));
    return (
      <div className={styles.wrapper}>
        <div className={styles.inputsWrapper}>
          <div className={styles.topInputsWrapper}>
            <FloatingLabel
              id="taskName"
              name="name"
              placeholder="Enter task name"
              className={styles.inputNameFilled}
              value={editedName}
              onChange={nameUpdateHandler}
              onBlur={setDefaultName}
            />
            <TaskCalendar task={task} />
          </div>
          <div ref={fakeText} className={styles.fakeText}>
            {editedDescription}
          </div>
          <label
            className={
              editedDescription || isTextareaFocused
                ? styles.descriptionFilled
                : styles.description
            }
            htmlFor="taskDescription"
          >
            <div className={styles.teaxtareaWrapper}>
              <Scrollbar
                style={{ height: 238 }}
                trackYProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                      <div
                        {...restProps}
                        ref={elementRef}
                        className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-EditTask"
                      />
                    );
                  },
                }}
              >
                <textarea
                  ref={textArea}
                  spellCheck="false"
                  id="taskDescription"
                  name="description"
                  value={editedDescription}
                  onChange={descriptionUpdateHandler}
                  onFocus={() => setTextareaFocused(true)}
                  onBlur={() => setTextareaFocused(false)}
                ></textarea>
              </Scrollbar>
            </div>
            <span
              style={{
                transition:
                  !prevDescription && editedDescription
                    ? "all 0ms"
                    : "all 200ms",
              }}
            >
              Enter task description
            </span>
          </label>
        </div>
        <div>
          <div className={styles.closeWrapper}>
            <img
              src={"/img/close.svg"}
              alt=" "
              className={styles.icon}
              onClick={() => setEditedTask(null)}
            />
          </div>
          <div className={styles.colorsWrapper}>{colorsElements}</div>
          <div className={styles.trashWrapper}>
            <img
              src="/img/trashBlue.svg"
              alt=" "
              className={styles.icon}
              onClick={deleteHandler}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
