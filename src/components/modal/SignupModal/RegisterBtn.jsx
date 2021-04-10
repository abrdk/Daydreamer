import styles from "@/styles/auth.module.scss";
import { useContext } from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { UsersContext } from "@/src/context/UsersContext";
import { TasksContext } from "@/src/context/TasksContext";
import { OptionsContext } from "@/src/context/OptionsContext";

export default function RegisterBtn({
  name,
  password,
  nameWarn,
  passwordWarn,
  setNameWarn,
  setPasswordWarn,
  registerBtnRef,
  setModal,
}) {
  const router = useRouter();
  const { mutateUser, signup, setIsUserLogout } = useContext(UsersContext);
  const { createProject, projectByQueryId, mutateProjects } = useContext(
    ProjectsContext
  );
  const { tasksByProjectId, createTask, mutateTasks } = useContext(
    TasksContext
  );
  const { setIsMenuOpened } = useContext(OptionsContext);

  const copyProject = async (user) => {
    setIsUserLogout(true);
    setIsMenuOpened(false);

    mutateUser(user, false);
    mutateProjects([], false);
    mutateTasks([], false);

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

    setModal(null);
    setIsUserLogout(false);
    router.push(`/gantt/${newProjectId}`);
  };

  const handleSignup = async () => {
    if (nameWarn || passwordWarn) {
      return;
    }
    if (!name) {
      setNameWarn("User name should not be empty");
      return;
    }
    if (!password) {
      setPasswordWarn("Password should not be empty");
      return;
    }
    if (name.length > 35) {
      setNameWarn("User name should be less than 35 characters");
      return;
    }
    if (password.length > 35) {
      setPasswordWarn("Password length should be less than 35 characters");
      return;
    }

    const newUser = {
      _id: nanoid(),
      name,
      password,
    };
    const res = await signup(newUser);
    if (res.message === "ok") {
      await copyProject(res.user);
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  return (
    <div
      ref={registerBtnRef}
      className={styles.primaryButton}
      onClick={handleSignup}
    >
      Registration
    </div>
  );
}
