import { useContext } from "react";
import styles from "@/styles/header.module.scss";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import useMedia from "use-media";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

export default function copyAndEditBtn({ setModal }) {
  const isMobile = useMedia({ maxWidth: 1200 });

  const router = useRouter();

  const { user, setIsUserLogout } = useContext(UsersContext);
  const { projectByQueryId, createProject, isUserOwnsProject } = useContext(
    ProjectsContext
  );
  const { createTask, tasksByProjectId } = useContext(TasksContext);
  const { setIsMenuOpened } = useContext(OptionsContext);

  const copyAndEdit = async () => {
    if (!user._id) {
      setModal("signup");
      return;
    }
    setIsUserLogout(true);
    setIsMenuOpened(false);
    const newProjectId = nanoid();
    await createProject({
      _id: newProjectId,
      name: projectByQueryId.name,
      owner: user._id,
      isCurrent: true,
    });
    const new_ids = tasksByProjectId.map((t) => nanoid());
    const old_ids = tasksByProjectId.map((t) => t._id);
    const newTasks = tasksByProjectId
      .map((t) => {
        const i = tasksByProjectId.indexOf(t);
        if (t.root) {
          if (new_ids[old_ids.indexOf(t.root)]) {
            return {
              ...t,
              _id: new_ids[i],
              project: newProjectId,
              owner: user._id,
              root: new_ids[old_ids.indexOf(t.root)],
            };
          }
        } else {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: user._id,
          };
        }
      })
      .filter((t) => t !== undefined);

    async function createTasks() {
      const promises = newTasks.map(async (task) => {
        await createTask(task);
      });
      await Promise.all(promises);
    }
    await createTasks();

    setIsUserLogout(false);
    router.push(`/gantt/${newProjectId}`);
  };

  return (
    <button
      className={
        isMobile
          ? `${styles.share_button} ${styles.copyBtn}`
          : styles.share_button
      }
      onClick={copyAndEdit}
    >
      Copy and Edit
    </button>
  );
}
