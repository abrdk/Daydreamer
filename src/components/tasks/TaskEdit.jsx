import { useContext, useState, useEffect, useRef } from "react";
import styles from "@/styles/taskEdit.module.scss";
import Scrollbar from "react-scrollbars-custom";
import FloatingLabel from "floating-label-react";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksEdit({ taskId }) {
  const { tasks, updateTask } = useContext(TasksContext);
  const task = tasks.find((t) => t._id == taskId);

  const fakeText = useRef(null);
  const textArea = useRef(null);

  const [editedName, setEditedName] = useState(() => (task ? task.name : ""));
  const [editedDescription, setEditedDescription] = useState(() =>
    task ? task.description : ""
  );

  const nameUpdateHandler = (e) => {
    updateTask({ ...task, name: e.target.value });
    setEditedName(e.target.value);
  };

  const descriptionUpdateHandler = (e) => {
    updateTask({ ...task, description: e.target.value });
    setEditedDescription(e.target.value);
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
    return (
      <div className={styles.wrapper}>
        <div className={styles.inputsWtapper}>
          <FloatingLabel
            id="taskName"
            name="name"
            placeholder="Enter task name"
            className={styles.inputNameFilled}
            value={editedName}
            onChange={nameUpdateHandler}
          />
          <div ref={fakeText} className={styles.fakeText}>
            {editedDescription}
          </div>
          <label className={styles.descriptionFilled} for="taskDescription">
            <div className={styles.teaxtareaWrapper}>
              <Scrollbar style={{ height: 238 }}>
                <textarea
                  ref={textArea}
                  id="taskDescription"
                  name="description"
                  value={editedDescription}
                  onChange={descriptionUpdateHandler}
                ></textarea>
              </Scrollbar>
            </div>
            <span>Enter task description</span>
          </label>
        </div>
        <div></div>
      </div>
    );
  } else {
    return <></>;
  }
}
