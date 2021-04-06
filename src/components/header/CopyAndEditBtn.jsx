import { useContext } from "react";
import styles from "@/styles/header.module.scss";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

export default function copyAndEditBtn({ setModal }) {
  const router = useRouter();

  const { user } = useContext(UsersContext);
  const { projectByQueryId, createProject } = useContext(ProjectsContext);
  const { createTask, tasksByProjectId } = useContext(TasksContext);
  const { setIsMenuOpened } = useContext(OptionsContext);

  const copyAndEdit = async () => {
    if (user._id) {
      setIsMenuOpened(false);
      const newProjectId = nanoid();
      await createProject({
        _id: newProjectId,
        name: projectByQueryId.name,
        owner: user._id,
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
            owner: user._id,
            root: new_ids[old_ids.indexOf(t.root)],
          };
        } else {
          return {
            ...t,
            _id: new_ids[i],
            project: newProjectId,
            owner: user._id,
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
    } else {
      setModal("signup");
    }
  };

  return (
    <button className={styles.share_button} onClick={copyAndEdit}>
      Copy and Edit
    </button>
  );
}
