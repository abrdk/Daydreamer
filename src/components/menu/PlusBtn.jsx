import { useContext, memo } from "react";
import styles from "@/styles/menu.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusSvg from "@/src/components/svg/PlusSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { OptionsContext } from "@/src/context/OptionsContext";

function InnerPlusBtn({
  createTask,
  setWhereEditNewTask,
  numOfTopLevelTasks,
  idOfProjectByQueryId,
  isUserOwnsProject,
  isMenuOpened,
}) {
  const handleCreateTask = () => {
    if (isMenuOpened) {
      setWhereEditNewTask("menu");
    } else {
      setWhereEditNewTask("calendar");
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
      today.getDate() + 6,
      23,
      59,
      59
    );

    createTask({
      _id: nanoid(),
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "258EFA",
      project: idOfProjectByQueryId,
      root: "",
      order: numOfTopLevelTasks,
    });
  };

  return (
    <When condition={isUserOwnsProject}>
      <div className={styles.bigPlus} onClick={handleCreateTask}>
        <PlusSvg />
      </div>
    </When>
  );
}

InnerPlusBtn = memo(
  InnerPlusBtn,
  (prevProps, nextProps) =>
    prevProps.numOfTopLevelTasks == nextProps.numOfTopLevelTasks &&
    prevProps.idOfProjectByQueryId == nextProps.idOfProjectByQueryId &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.isMenuOpened == nextProps.isMenuOpened
);

export default function PlusBtn() {
  const { createTask, tasksByProjectId, setWhereEditNewTask } = useContext(
    TasksContext
  );
  const { projectByQueryId, isUserOwnsProject } = useContext(ProjectsContext);
  const { isMenuOpened } = useContext(OptionsContext);

  const numOfTopLevelTasks = tasksByProjectId.filter((task) => !task.root)
    .length;

  return (
    <InnerPlusBtn
      {...{
        createTask,
        setWhereEditNewTask,
        numOfTopLevelTasks,
        idOfProjectByQueryId: projectByQueryId._id,
        isUserOwnsProject,
        isMenuOpened,
      }}
    />
  );
}
