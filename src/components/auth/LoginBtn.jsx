import styles from "@/styles/auth.module.scss";
import { useContext } from "react";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { UsersContext } from "@/src/context/UsersContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function LoginBtn({
  name,
  password,
  nameWarn,
  passwordWarn,
  setNameWarn,
  setPasswordWarn,
  loginBtnRef,
}) {
  const { login, mutateUser } = useContext(UsersContext);
  const { mutateProjects } = useContext(ProjectsContext);
  const { mutateTasks } = useContext(TasksContext);

  const handleLogin = async () => {
    if (nameWarn || passwordWarn) {
      return;
    }
    const res = await login({
      name,
      password,
    });
    if (res.message === "ok") {
      mutateTasks();
      mutateProjects();
      mutateUser(res.user, false);
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
      ref={loginBtnRef}
      className={styles.primaryButton}
      onClick={handleLogin}
    >
      Sign in
    </div>
  );
}
