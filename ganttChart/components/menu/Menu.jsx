import { useState } from "react";
import styles from "../../../pages/gantt/Gantt.module.css";

import DropDown from "./DropDown";
import TasksRoot from "../tasks/TasksRoot";

export default function Menu({ modal }) {
  const [isMenuOpen, setMenu] = useState(false);

  const [isDropdownOpen, setDropdown] = useState(false);

  return (
    <>
      <div
        className={
          isMenuOpen
            ? modal || isDropdownOpen
              ? styles.menuIconWrapOpened
              : ""
            : modal
            ? styles.menuIconWrap
            : ""
        }
        onClick={() => setDropdown(!isDropdownOpen)}
      ></div>
      <div
        id="mainMenuLeft"
        className="mainMenuLeft"
        onClick={() => {
          document.querySelector("#mainMenuLeft").classList.toggle("active");
          setMenu(!isMenuOpen);
        }}
      >
        {isMenuOpen ? (
          <img src="/img/arrowLeft.svg" alt="close" />
        ) : (
          <img src="/img/arrowRight.svg" alt="close" />
        )}
      </div>

      <div
        className={isMenuOpen ? styles.mainMenuOpened : styles.mainMenu}
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <DropDown isDropdownOpen={isDropdownOpen} setDropdown={setDropdown} />
        <div className={styles.line}></div>
        <div className={styles.tasksHeaderWrapper}>
          <div className={styles.tasksHeader}>TASK NAME</div>
        </div>
        <div className={styles.line}></div>

        <TasksRoot root={""} />
      </div>
    </>
  );
}
