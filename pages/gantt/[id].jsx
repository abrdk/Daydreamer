import Head from "next/head";
import { useState, useContext } from "react";
import styles from "./Gantt.module.css";
import { When } from "react-if";

import { Modal } from "../../ganttChart/components/modal/modal";
import { ViewSwitcher } from "../../ganttChart/components/viewSwitcher/viewSwitcher";
import { ViewMode } from "../../ganttChart/types/public-types";
import Menu from "../../ganttChart/components/menu/Menu";

import { UsersContext } from "../../ganttChart/context/users/UsersContext";
import { ProjectsContext } from "../../ganttChart/context/projects/ProjectsContext";
import { TasksContext } from "../../ganttChart/context/tasks/TasksContext";

// name of project
let id = "new";

export default function Gantt() {
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);

  const userCtx = useContext(UsersContext);
  const { isProjectsLoaded } = useContext(ProjectsContext);
  const { isTasksLoaded } = useContext(TasksContext);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When
        condition={
          userCtx.isUserLoaded &&
          userCtx.name &&
          isProjectsLoaded &&
          isTasksLoaded
        }
      >
        <Modal modal={modal} setModal={setModal} id={id} />
        <div className={styles.container}>
          <Menu modal={modal} />
          <div className={styles.header}>
            <ViewSwitcher onViewModeChange={(viewMode) => setView(viewMode)} />
            <div />
            <div className={styles.buttonsContainer}>
              <button
                className={styles.share_button}
                onClick={setModal.bind(null, "share")}
              >
                Share Project
              </button>
              <button
                className={styles.account_button}
                onClick={setModal.bind(null, "account")}
              >
                <img src="/img/avatar.svg" alt=" " />{" "}
                <span>
                  {userCtx.name.length > 10
                    ? userCtx.name.slice(0, 10) + "..."
                    : userCtx.name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </When>
    </>
  );
}
