import { useState, useContext } from "react";
import styles from "../../../pages/gantt/Gantt.module.css";

import { UsersContext } from "../../context/users/UsersContext";
import { ProjectsContext } from "../../context/projects/ProjectsContext";

import DropDown from "./DropDown";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);

  const [isDropdownOpen, setDropdown] = useState(false);

  const userCtx = useContext(UsersContext);
  const { projects } = useContext(ProjectsContext);

  return (
    <>
      <div
        className={isDropdownOpen ? styles.menuIconWrap : ""}
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
      </div>
    </>
  );
}
