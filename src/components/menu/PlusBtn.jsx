import { useContext } from "react";
import styles from "@/styles/menu.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusSvg from "@/src/components/svg/PlusSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { OptionsContext } from "@/src/context/OptionsContext";

export default function PlusBtn() {
  const { createTask, tasksByProjectId, setWhereEditNewTask } = useContext(
    TasksContext
  );
  const { projectByQueryId, isUserOwnsProject } = useContext(ProjectsContext);
  const { isMenuOpened } = useContext(OptionsContext);

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

    const topLevelTasks = tasksByProjectId.filter((task) => !task.root);

    createTask({
      _id: nanoid(),
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "258EFA",
      project: projectByQueryId._id,
      root: "",
      order: topLevelTasks.length,
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
