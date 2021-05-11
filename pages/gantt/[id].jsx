import Head from "next/head";
import { useState, useContext, memo, useEffect } from "react";
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
  isUserLogout,
}) {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // window.oncontextmenu = function (event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return false;
    // };

    var customViewportCorrectionVariable = "vh";
    function setViewportProperty(doc) {
      var prevClientHeight;
      var customVar = "--" + (customViewportCorrectionVariable || "vh");
      function handleResize() {
        var clientHeight = doc.clientHeight;
        if (clientHeight === prevClientHeight) return;
        requestAnimationFrame(function updateViewportHeight() {
          doc.style.setProperty(customVar, clientHeight * 0.01 + "px");
          prevClientHeight = clientHeight;
        });
      }
      handleResize();
      return handleResize;
    }
    window.addEventListener(
      "resize",
      setViewportProperty(document.documentElement)
    );
  }, []);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <When
        condition={
          isUserLoaded &&
          isProjectsLoaded &&
          isTasksLoaded &&
          hasProjectByQueryId &&
          hasTasksByProjectId &&
          !isUserLogout
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
  const { isUserLoaded, isUserLogout } = useContext(UsersContext);
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
        isUserLogout,
      }}
    />
  );
}
