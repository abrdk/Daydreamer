import { useState, useContext } from "react";
import styles from "@/styles/menu.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import TaskEdit from "@/src/components/tasks/Edit/TaskEdit";
import ProjectsDropdown from "@/src/components/projects/ProjectsDropdown";
import Tasks from "@/src/components/tasks/Tasks";

import ArrowRightSvg from "@/src/components/svg/ArrowRightSvg";
import ArrowLeft from "@/src/components/svg/ArrowLeft";
import PlusSvg from "@/src/components/svg/PlusSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function Menu({ isMenuOpen, setMenu }) {
  const { user } = useContext(UsersContext);
  const { createTask, tasksByProjectId, setWhereEditNewTask } = useContext(
    TasksContext
  );
  const { projectByQueryId } = useContext(ProjectsContext);

  const [isDropdownOpen, setDropdown] = useState(false);

  const openMenuHandler = () => {
    setMenu(!isMenuOpen);
  };

  const createTaskHandler = () => {
    if (isMenuOpen) {
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
    <>
      <div className={styles.iconOpen} onClick={openMenuHandler}>
        <ArrowRightSvg />
      </div>

      <div
        className={isMenuOpen ? styles.mainMenuOpened : styles.mainMenu}
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        id={isMenuOpen ? "openedMenu" : "closedMenu"}
      >
        <div className={styles.iconClose} onClick={openMenuHandler}>
          <ArrowLeft />
        </div>
        <ProjectsDropdown
          isDropdownOpen={isDropdownOpen}
          setDropdown={setDropdown}
        />
        <Tasks />
        <TaskEdit isMenuOpen={isMenuOpen} />
      </div>
      <When condition={projectByQueryId.owner == user._id}>
        <div className={styles.bigPlus} onClick={createTaskHandler}>
          <PlusSvg />
        </div>
      </When>
    </>
  );
}
