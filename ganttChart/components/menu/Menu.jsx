import { useState } from "react";
import styles from "../../../pages/gantt/Gantt.module.css";

import ProjectsDropdown from "./ProjectsDropdown";
import Tasks from "../tasks/Tasks";

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
        <ProjectsDropdown
          isDropdownOpen={isDropdownOpen}
          setDropdown={setDropdown}
        />
        <Tasks />
      </div>
    </>
  );
}
