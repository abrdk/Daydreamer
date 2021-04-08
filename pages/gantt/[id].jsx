import Head from "next/head";
import { useState, useContext, memo } from "react";
import styles from "@/styles/header.module.scss";
import { When } from "react-if";

import { Modal } from "@/src/components/modal/Modal";
import Menu from "@/src/components/menu/Menu";
import Calendar from "@/src/components/calendar/Calendar";
import Header from "@/src/components/header/Header";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

function InnerGantt({
  isUserLoaded,
  isProjectsLoaded,
  isTasksLoaded,
  hasProjectByQueryId,
  hasTasksByProjectId,
}) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When
        condition={
          isUserLoaded &&
          isProjectsLoaded &&
          isTasksLoaded &&
          hasProjectByQueryId &&
          hasTasksByProjectId
        }
      >
        <Modal modal={modal} setModal={setModal} />
        <div className={styles.container} id="container">
          <Menu />
          <Header setModal={setModal} />
        </div>
        <Calendar />
      </When>
    </>
  );
}

InnerGantt = memo(InnerGantt);

export default function Gantt() {
  const { isUserLoaded } = useContext(UsersContext);
  const { isProjectsLoaded, projectByQueryId } = useContext(ProjectsContext);
  const { isTasksLoaded, tasksByProjectId } = useContext(TasksContext);

  const hasProjectByQueryId = !!projectByQueryId;
  const hasTasksByProjectId = !!tasksByProjectId;

  return (
    <InnerGantt
      {...{
        isUserLoaded,
        isProjectsLoaded,
        isTasksLoaded,
        hasProjectByQueryId,
        hasTasksByProjectId,
      }}
    />
  );
}
