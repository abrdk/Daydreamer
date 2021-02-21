import { useState, useContext } from "react";
import styles from "@/styles/menu.module.scss";
import { nanoid } from "nanoid";
import { When } from "react-if";

import TaskEdit from "@/src/components/tasks/TaskEdit";
import ProjectsDropdown from "@/src/components/projects/ProjectsDropdown";
import Tasks from "@/src/components/tasks/Tasks";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src//context/projects/ProjectsContext";

export default function Menu({
  isMenuOpen,
  setMenu,
  editedTask,
  setEditedTask,
}) {
  const userCtx = useContext(UsersContext);
  const { tasks, createTask } = useContext(TasksContext);
  const { projectByQueryId } = useContext(ProjectsContext);

  const [isDropdownOpen, setDropdown] = useState(false);

  const openMenuHandler = () => {
    setEditedTask(null);
    setMenu(!isMenuOpen);
  };

  const createTaskHandler = async () => {
    setMenu(true);

    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    let afterWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
      23,
      59,
      59
    );

    const topLevelTasks = tasks.filter(
      (task) => !task.root && task.project == projectByQueryId._id
    );

    await createTask({
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
      <When condition={projectByQueryId.owner == userCtx._id}>
        <img
          src="/img/plus.svg"
          alt=" "
          className={styles.bigPlus}
          onClick={createTaskHandler}
        />
      </When>
    </>
  );
}
