import { useState } from "react";
import styles from "@/styles/menu.module.scss";

import ProjectsDropdown from "@/src/components/projects/ProjectsDropdown";
import Tasks from "@/src/components/tasks/Tasks";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);
  const [isDropdownOpen, setDropdown] = useState(false);

  const openMenuHandler = () => {
    setMenu(!isMenuOpen);
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
        <Tasks />
      </div>
    </>
  );
}
