import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import styles from "@/styles/header.module.scss";
import { When, If, Then, Else } from "react-if";
import Truncate from "react-truncate";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import ReactCursorPosition from "react-cursor-position";
import usePrevious from "@react-hook/previous";

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

  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);
  const [isMenuOpen, setMenu] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  const userCtx = useContext(UsersContext);
  const { isProjectsLoaded, projectByQueryId, createProject } = useContext(
    ProjectsContext
  );
  const {
    isTasksLoaded,
    createTask,
    sortedTasksIds,
    tasksByProjectId,
    isTasksSorting,
  } = useContext(TasksContext);

  const prevSortedTasksIds = usePrevious(sortedTasksIds);

  const [isSubtasksOpened, setIsSubtasksOpened] = useState([]);

  useEffect(() => {
    if (prevSortedTasksIds && !isTasksSorting) {
      if (sortedTasksIds.length > prevSortedTasksIds.length) {
        let newSubtasksOpenedList = sortedTasksIds.map((t) => false);
        prevSortedTasksIds.forEach((_id, i) => {
          if (sortedTasksIds.indexOf(_id) >= 0) {
            newSubtasksOpenedList[sortedTasksIds.indexOf(_id)] =
              isSubtasksOpened[sortedTasksIds.indexOf(_id)];
          }
        });
        setIsSubtasksOpened(newSubtasksOpenedList);
      } else if (sortedTasksIds.length < prevSortedTasksIds.length) {
        let newSubtasksOpenedList = sortedTasksIds.map((t) => false);
        prevSortedTasksIds.forEach((_id, i) => {
          if (sortedTasksIds.indexOf(_id) >= 0) {
            newSubtasksOpenedList[sortedTasksIds.indexOf(_id)] =
              isSubtasksOpened[i];
          }
        });
        setIsSubtasksOpened(newSubtasksOpenedList);
      } else {
        let newSubtasksOpenedList = sortedTasksIds.map((t) => false);
        prevSortedTasksIds.forEach((_id, i) => {
          if (sortedTasksIds.indexOf(_id) >= 0) {
            newSubtasksOpenedList[sortedTasksIds.indexOf(_id)] =
              isSubtasksOpened[i];
          }
        });
        setIsSubtasksOpened(newSubtasksOpenedList);
      }
    }
  }, [sortedTasksIds]);

  const copyAndEdit = async () => {
    if (userCtx._id) {
      setMenu(false);
      const newProjectId = nanoid();
      await createProject({
        _id: newProjectId,
        name: projectByQueryId.name,
        owner: userCtx._id,
      });
      const new_ids = tasksByProjectId.map((t) => nanoid());
      const old_ids = tasksByProjectId.map((t) => t._id);

      const newTasks = tasksByProjectId.map((t) => {
        const i = tasksByProjectId.indexOf(t);
        if (t.root) {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: userCtx._id,
            root: new_ids[old_ids.indexOf(t.root)],
          };
        } else {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: userCtx._id,
          };
        }
      });

      async function createTasks() {
        const promises = newTasks.map(async (task) => {
          await createTask(task);
        });
        await Promise.all(promises);
      }
      await createTasks();

      router.push(`/gantt/${newProjectId}`);
      setTimeout(() => router.reload(), 100);
    }
  };

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
          projectByQueryId._id
        }
      >
        <Modal modal={modal} setModal={setModal} />
        <div className={styles.container} id="container">
          <Menu
            isMenuOpen={isMenuOpen}
            setMenu={setMenu}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            isSubtasksOpened={isSubtasksOpened}
            setIsSubtasksOpened={setIsSubtasksOpened}
          />
          <div className={styles.header}>
            <ViewSwitcher
              isMenuOpen={isMenuOpen}
              onViewModeChange={(viewMode) => setView(viewMode)}
            />
            <div className={styles.buttonsContainer}>
              <If condition={projectByQueryId.owner == userCtx._id}>
                <Then>
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
                </Then>
                <Else>
                  <button className={styles.share_button} onClick={copyAndEdit}>
                    Copy and Edit
                  </button>
                </Else>
              </If>
            </div>
          </div>
        </div>
        <ReactCursorPosition>
          <Calendar
            setMenu={setMenu}
            view={view}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            isSubtasksOpened={isSubtasksOpened}
            setIsSubtasksOpened={setIsSubtasksOpened}
          />
        </ReactCursorPosition>
      </When>
    </>
  );
}
