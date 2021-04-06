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
  const { createProject, mutateProjects } = useContext(ProjectsContext);
  const { createInitialTasks, mutateTasks } = useContext(TasksContext);

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
    if (!password) {
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
      mutateProjects([], false);
      mutateTasks([], false);
      const projectId = nanoid();
      await createProject({
        _id: projectId,
        name: `Project name #1`,
        owner: res.user._id,
        isCurrent: true,
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
