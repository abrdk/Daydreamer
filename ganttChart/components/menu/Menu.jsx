import { useState, useContext } from "react";
import styles from "../../../pages/gantt/Gantt.module.css";

import { UsersContext } from "../../context/users/UsersContext";
import { ProjectsContext } from "../../context/projects/ProjectsContext";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);

  const userCtx = useContext(UsersContext);
  const projectsCtx = useContext(ProjectsContext);

  return (
    <>
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
        {/* <div className={styles.mainMenuHeader}>
            Проекты
            <img
              src="/img/add.png"
              alt="add"
              onClick={() => setModal("create")}
            />
          </div>
          {charts.map((k) => (
            <div
              key={k._id}
              className={styles.mainMenuRow}
              style={{ backgroundColor: k._id === id ? "#4D527F" : "" }}
            >
              <div>
                {k.name}
                <img
                  style={{ marginLeft: "8px" }}
                  src="/img/edit.png"
                  alt="edit"
                  onClick={() => {
                    setLoad(k.chart);
                    setName(k.name);
                    id = k._id;
                  }}
                />
              </div>
              <img
                src="/img/delete.png"
                alt="delete"
                onClick={() => {
                  setName(k.name);
                  id = k._id;
                  setModal("delete");
                }}
              />
            </div>
          ))} */}
        {/* {userCtx.id ? (
            <Link href="/logout">
              <a className={styles.logOut}>Выйти из аккаунта</a>
            </Link>
          ) : (
            <Link href="/signup">
              <a className={styles.logOut}>Регистрация</a>
            </Link>
          )} */}
      </div>
    </>
  );
}
