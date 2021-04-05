import Head from "next/head";
import { useState, useContext } from "react";
import styles from "@/styles/header.module.scss";
import { When } from "react-if";

import { Modal } from "@/src/components/modal/modal";
import { ViewMode } from "@/src/types/public-types";
import Menu from "@/src/components/menu/Menu";
import Calendar from "@/src/components/calendar/Calendar";
import Header from "@/src/components/header/Header";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Gantt() {
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);
  const [isMenuOpen, setMenu] = useState(false);

  const userCtx = useContext(UsersContext);
  const { isProjectsLoaded, projectByQueryId, projects } = useContext(
    ProjectsContext
  );
  const { isTasksLoaded, tasksByProjectId, tasks } = useContext(TasksContext);
  // console.log("tasks", tasks);
  // console.log("tasksByProjectId", tasksByProjectId);
  // console.log("projects", projects);
  // console.log("projectByQueryId", projectByQueryId);
  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When
        condition={
          userCtx.isUserLoaded &&
          isProjectsLoaded &&
          isTasksLoaded &&
          projectByQueryId &&
          tasksByProjectId
        }
      >
        <Modal modal={modal} setModal={setModal} />
        <div className={styles.container} id="container">
          <Menu isMenuOpen={isMenuOpen} setMenu={setMenu} />
          <Header
            setMenu={setMenu}
            setView={setView}
            isMenuOpen={isMenuOpen}
            setModal={setModal}
          />
        </div>
        <Calendar setMenu={setMenu} view={view} />
      </When>
    </>
  );
}
