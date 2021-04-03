import { useContext, useState, useEffect, useRef } from "react";
import styles from "@/styles/taskEdit.module.scss";
import Scrollbar from "react-scrollbars-custom";
import FloatingLabel from "floating-label-react";
import usePrevious from "@react-hook/previous";
import { When } from "react-if";

import TaskCalendar from "@/src/components/tasks/Edit/TaskCalendar";
import Cross from "@/src/components/svg/Cross";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksEdit({ taskId, setEditedTask, isMenuOpen }) {
  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const { tasksByProjectId, updateTask, deleteTask } = useContext(TasksContext);
  const task = tasksByProjectId.find((t) => t._id == taskId);

  const fakeText = useRef(null);
  const textArea = useRef(null);

  const [editedName, setEditedName] = useState("");
  const [editedColor, setEditedColor] = useState("");
  const [editedDescription, setEditedDescription] = useState(() =>
    task ? task.description : ""
  );
  const prevDescription = usePrevious(editedDescription);
  const [isTextareaFocused, setTextareaFocused] = useState(false);

  const nameUpdateHandler = (e) => {
    if (e.target.value.length <= 100) {
      setEditedName(e.target.value);
      updateTask({ ...task, name: e.target.value });
    }
  };
  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const setName = (e) => {
    if (!e.target.value) {
      updateTask({ ...task, name: getDefaultName() });
    }
  };

  const descriptionUpdateHandler = (e) => {
    setEditedDescription(e.target.value);
  };
  const setDescription = (e) => {
    setTextareaFocused(false);
    updateTask({ ...task, description: e.target.value });
  };

  const colorUpdateHandler = (color) => {
    setEditedColor(color);
    updateTask({ ...task, color });
  };

  const deleteHandler = () => {
    tasksByProjectId
      .filter((t) => t.root == task.root)
      .slice(task.order + 1)
      .forEach((t) => {
        updateTask({ ...t, order: t.order - 1 });
      });
    deleteTask(taskId);
    setEditedTask(null);
  };

  useEffect(() => {
    if (task) {
      setEditedName(task.name);
      setEditedDescription(task.description);
      setEditedColor(task.color);
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
        className={styles.color}
        style={{
          background: editedColor == color && `#fff`,
          border: editedColor == color && `1px solid #${color}`,
        }}
        onClick={() => colorUpdateHandler(color)}
      >
        <div className={styles.colorInner}></div>
      </div>
    ));
    return (
      <div
        className={styles.wrapper}
        style={{ width: isMenuOpen ? "calc(100vw - 335px)" : "100vw" }}
        id="editTask"
      >
        <div className={styles.inputsWrapper}>
          <div className={styles.topInputsWrapper}>
            <FloatingLabel
              id="taskName"
              name="name"
              placeholder="Enter task name"
              className={styles.inputNameFilled}
              value={editedName}
              onChange={nameUpdateHandler}
              onBlur={setName}
              onFocus={(e) => {
                if (projectByQueryId.owner != userCtx._id) {
                  e.target.blur();
                }
              }}
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
                  onFocus={(e) => {
                    if (projectByQueryId.owner != userCtx._id) {
                      e.target.blur();
                    } else {
                      setTextareaFocused(true);
                    }
                  }}
                  onBlur={setDescription}
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
            <div
              className={styles.crossIcon}
              onClick={() => setEditedTask(null)}
            >
              <Cross />
            </div>
          </div>
          <When condition={projectByQueryId.owner == userCtx._id}>
            <div className={styles.colorsWrapper}>{colorsElements}</div>
            <div className={styles.trashWrapper}>
              <img
                src="/img/trashBlue.svg"
                alt=" "
                className={styles.icon}
                onClick={deleteHandler}
              />
            </div>
          </When>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
