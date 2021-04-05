import styles from "@/styles/auth.module.scss";
import { useContext } from "react";
import { nanoid } from "nanoid";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { UsersContext } from "@/src/context/UsersContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function RegisterBtn({
  name,
  password,
  nameWarn,
  passwordWarn,
  setNameWarn,
  setPasswordWarn,
  registerBtnRef,
}) {
  const { mutateUser, signup } = useContext(UsersContext);
  const { createProject } = useContext(ProjectsContext);
  const { createInitialTasks } = useContext(TasksContext);

  const handleSignup = async () => {
    if (nameWarn || passwordWarn) {
      return;
    }

    const newUser = {
      _id: nanoid(),
      name,
      password,
    };
    const res = await signup(newUser);
    if (res.message === "ok") {
      const projectId = nanoid();
      await createProject({
        _id: projectId,
        name: `Project name #1`,
        owner: res.user._id,
      });
      await createInitialTasks({ project: projectId });
      mutateUser(newUser, false);
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
