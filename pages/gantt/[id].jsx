import Head from "next/head";
import { useState, useContext } from "react";
import styles from "@/styles/header.module.scss";
import { When } from "react-if";
import Truncate from "react-truncate";
import { useRouter } from "next/router";
import ReactCursorPosition, { INTERACTIONS } from "react-cursor-position";

import { Modal } from "@/src/components/modal/modal";
import { ViewSwitcher } from "@/src/components/viewSwitcher/viewSwitcher";
import { ViewMode } from "@/src/types/public-types";
import Menu from "@/src/components/menu/Menu";
import Calendar from "@/src/components/calendar/Calendar";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Gantt() {
  const router = useRouter();
  const { id } = router.query;
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);

  const userCtx = useContext(UsersContext);
  const { isProjectsLoaded, projects } = useContext(ProjectsContext);
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
          isTasksLoaded &&
          projects.find((p) => p._id == id)
        }
      >
        <Modal modal={modal} setModal={setModal} />
        <ReactCursorPosition>
          <div className={styles.container}>
            <Menu modal={modal} />
            <div className={styles.header}>
              <ViewSwitcher
                onViewModeChange={(viewMode) => setView(viewMode)}
              />
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
                  <Truncate lines={1} width={100}>
                    {userCtx.name}
                  </Truncate>
                </button>
              </div>
            </div>
          </div>
          <Calendar view={view} />
        </ReactCursorPosition>
      </When>
    </>
  );
}
