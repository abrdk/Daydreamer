import { useState, useContext } from "react";
import styles from "@/styles/menu.module.scss";
import { nanoid } from "nanoid";

import TaskEdit from "@/src/components/tasks/TaskEdit";
import ProjectsDropdown from "@/src/components/projects/ProjectsDropdown";
import Tasks from "@/src/components/tasks/Tasks";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { ProjectsContext } from "@/src//context/projects/ProjectsContext";

export default function Menu() {
  const { tasks, createTask } = useContext(TasksContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }

  const [isMenuOpen, setMenu] = useState(false);
  const [isDropdownOpen, setDropdown] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  const openMenuHandler = () => {
    setEditedTask(null);
    setMenu(!isMenuOpen);
  };

  const createTaskHandler = async () => {
    setMenu(true);

    const currentDate = new Date();
    let afterWeek = new Date();
    afterWeek.setDate(currentDate.getDate() + 7);

    const topLevelTasks = tasks.filter(
      (task) => !task.root && task.project == currentProject._id
    );

    await createTask({
      _id: nanoid(),
      name: "",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "258EFA",
      project: currentProject._id,
      root: "",
      order: topLevelTasks.length,
    });
  };

  return (
    <>
      <div className={styles.iconOpen} onClick={openMenuHandler}>
        <img src="/img/arrowRight.svg" alt="close" />
      </div>

      <div
        className={isMenuOpen ? styles.mainMenuOpened : styles.mainMenu}
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className={styles.iconClose} onClick={openMenuHandler}>
          <img src="/img/arrowLeft.svg" alt="close" />
        </div>
        <ProjectsDropdown
          isDropdownOpen={isDropdownOpen}
          setDropdown={setDropdown}
        />
        <Tasks editedTask={editedTask} setEditedTask={setEditedTask} />
        <TaskEdit taskId={editedTask} setEditedTask={setEditedTask} />
      </div>
      <img
        src="/img/plus.svg"
        alt=" "
        className={styles.bigPlus}
        onClick={createTaskHandler}
      />
    </>
  );
}
