import { useContext, useEffect, useState, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import FloatingLabel from "floating-label-react";
import { When } from "react-if";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerEditNameForm({
  task,
  isUserOwnsProject,
  whereEditNewTask,
  setWhereEditNewTask,
  updateTask,
}) {
  const [editedName, setEditedName] = useState("");

  const handleNameUpdate = (e) => {
    if (e.target.value.length <= 100) {
      setEditedName(e.target.value);
      updateTask({ ...task, name: e.target.value });
    }
  };

  const getDefaultName = () =>
    !task.root
      ? `Task name #${task.order + 1}`
      : `Subtask name #${task.order + 1}`;

  const handleBlur = (e) => {
    if (!e.target.value) {
      setEditedName(getDefaultName());
      updateTask({ ...task, name: getDefaultName() });
    }
  };

  const handleFocus = (e) => {
    if (!isUserOwnsProject) {
      e.target.blur();
    }
  };

  useEffect(() => {
    if (task && task.name == "" && whereEditNewTask == "edit") {
      document.querySelector("#taskName").focus();
      setWhereEditNewTask("");
    }
  }, [task, whereEditNewTask]);

  useEffect(() => {
    if (task) {
      setEditedName(task.name);
    }
  }, [task.name]);

  return (
    <>
      <FloatingLabel
        id="taskName"
        name="name"
        placeholder="Enter task name"
        className={styles.inputNameFilled}
        value={editedName}
        onChange={handleNameUpdate}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <When condition={task.name == ""}>
        <div className={styles.hiddenName}>{getDefaultName()}</div>
      </When>
    </>
  );
}

InnerEditNameForm = memo(InnerEditNameForm, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.whereEditNewTask == nextProps.whereEditNewTask
  );
});

export default function EditNameForm({ task }) {
  const { isUserOwnsProject } = useContext(ProjectsContext);

  const { updateTask, whereEditNewTask, setWhereEditNewTask } = useContext(
    TasksContext
  );

  return (
    <InnerEditNameForm
      {...{
        task,
        isUserOwnsProject,
        whereEditNewTask,
        setWhereEditNewTask,
        updateTask,
      }}
    />
  );
}
