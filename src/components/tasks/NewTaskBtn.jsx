import { useContext, memo } from "react";
import styles from "@/styles/tasks.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

const blueColor = "258EFA";
const defaultTaskDuration = 7;

function InnerNewTaskBtn({
  createTask,
  setWhereEditNewTask,
  setEditedTaskId,
  numOfTopLevelTasks,
  editedTaskId,
  idOfProjectByQueryId,
  isUserOwnsProject,
}) {
  const createNewTask = () => {
    const newTaskId = nanoid();

    if (editedTaskId) {
      setTimeout(() => setEditedTaskId(newTaskId), 100);
      setWhereEditNewTask("edit");
    } else {
      setWhereEditNewTask("menu");
    }

    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    let afterWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + defaultTaskDuration - 1,
      23,
      59,
      59
    );

    createTask({
      _id: newTaskId,
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: blueColor,
      project: idOfProjectByQueryId,
      root: "",
      order: numOfTopLevelTasks,
    });
  };

  return (
    <When condition={isUserOwnsProject}>
      <div className={styles.newTaskBtn} onClick={createNewTask}>
        + New Task
      </div>
    </When>
  );
}

InnerNewTaskBtn = memo(
  InnerNewTaskBtn,
  (prevProps, nextProps) =>
    prevProps.numOfTopLevelTasks == nextProps.numOfTopLevelTasks &&
    prevProps.idOfProjectByQueryId == nextProps.idOfProjectByQueryId &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.editedTaskId == nextProps.editedTaskId
);

export default function NewTaskBtn() {
  const {
    createTask,
    tasksByProjectId,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
  } = useContext(TasksContext);

  const { projectByQueryId, isUserOwnsProject } = useContext(ProjectsContext);

  const numOfTopLevelTasks = tasksByProjectId.filter((task) => !task.root)
    .length;

  return (
    <InnerNewTaskBtn
      {...{
        createTask,
        setWhereEditNewTask,
        setEditedTaskId,
        numOfTopLevelTasks,
        editedTaskId,
        idOfProjectByQueryId: projectByQueryId._id,
        isUserOwnsProject,
      }}
    />
  );
}
