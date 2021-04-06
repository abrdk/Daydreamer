import { useState, useContext } from "react";
import styles from "@/styles/menu.module.scss";

import TaskEdit from "@/src/components/tasks/Edit/TaskEdit";
import ProjectsDropdown from "@/src/components/projects/ProjectsDropdown";
import Tasks from "@/src/components/tasks/Tasks";
import PlusBtn from "@/src/components/menu/PlusBtn";

import ArrowRightSvg from "@/src/components/svg/ArrowRightSvg";
import ArrowLeft from "@/src/components/svg/ArrowLeft";

import { OptionsContext } from "@/src/context/OptionsContext";

export default function Menu() {
  const { isMenuOpened, setIsMenuOpened } = useContext(OptionsContext);

  const openMenuHandler = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <>
      <div className={styles.iconOpen} onClick={openMenuHandler}>
        <ArrowRightSvg />
      </div>

      <div
        className={isMenuOpened ? styles.mainMenuOpened : styles.mainMenu}
        style={{
          transform: isMenuOpened ? "translateX(0)" : "translateX(-100%)",
        }}
        id={isMenuOpened ? "openedMenu" : "closedMenu"}
      >
        <div className={styles.iconClose} onClick={openMenuHandler}>
          <ArrowLeft />
        </div>
        <ProjectsDropdown />
        <Tasks />
        <TaskEdit />
      </div>

      <PlusBtn />
    </>
  );
}
