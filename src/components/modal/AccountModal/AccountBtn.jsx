import Cookies from "js-cookie";
import { useContext } from "react";
import styles from "@/styles/account.module.scss";
import baseStyles from "@/styles/base.module.scss";
import Router from "next/router";
import { Else, If, Then } from "react-if";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function AccountBtn({
  name,
  password,
  nameWarn,
  passwordWarn,
  setNameWarn,
  setPasswordWarn,
  isUpdatingComplete,
  setIsUpdatingComplete,
  saveBtnRef,
}) {
  const { user, updateUser, mutateUser } = useContext(UsersContext);
  const { mutateProjects } = useContext(ProjectsContext);
  const { mutateTasks } = useContext(TasksContext);

  const isDataUpdating = () =>
    !(name === user.name && password === user.password && user._id != "");

  const handleUserUpdate = async () => {
    try {
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

      const res = await updateUser({
        name,
        password,
      });
      if (res.message === "ok") {
        mutateUser(res.user, false);
        setIsUpdatingComplete(true);
        setTimeout(() => setIsUpdatingComplete(false), 1000);
      } else {
        if (res.errorType === "name") {
          setNameWarn(res.message);
        } else if (res.errorType === "password") {
          setPasswordWarn(res.message);
        }
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    mutateUser({ _id: "", name: "", password: "" }, false);
    mutateProjects(false, false);
    mutateTasks(false, false);
    Cookies.remove("ganttToken", { path: "/" });
    Router.push("/signup");
  };

  return (
    <If condition={isUpdatingComplete}>
      <Then>
        <div className={baseStyles.successButton}>Your data was changed</div>
      </Then>
      <Else>
        <If condition={isDataUpdating()}>
          <Then>
            <div
              ref={saveBtnRef}
              className={styles.accountSecondaryButton}
              onClick={handleUserUpdate}
            >
              Save data
            </div>
          </Then>
          <Else>
            <div className={styles.accountPrimaryButton} onClick={handleLogout}>
              Log out
            </div>
          </Else>
        </If>
      </Else>
    </If>
  );
}
