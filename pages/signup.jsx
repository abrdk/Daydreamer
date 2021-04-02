import Cookies from "js-cookie";
import Head from "next/head";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/auth.module.scss";
import { useRouter } from "next/router";
import { When } from "react-if";
import FloatingLabel from "floating-label-react";

import DefaultGantt from "@/src/components/default/DefaultGantt";
import Eye from "@/src/components/svg/Eye";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Signup() {
  const router = useRouter();

  const registerBtn = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { isUserLoaded, setUser, _id, signup } = useContext(UsersContext);
  const { createProject, projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }
  const { createInitialTasks } = useContext(TasksContext);

  const unsetWarnings = (e) => {
    if (e.target != registerBtn.current) {
      setNameWarn(null);
      setPasswordWarn(null);
    }
  };

  const getNameInputClass = () => {
    if (nameWarn) {
      if (name) {
        return styles.formInputFilledWarn;
      }
      return styles.formInputWarn;
    }
    if (name) {
      return styles.formInputFilled;
    }
    return styles.formInput;
  };

  const getPasswordInputClass = () => {
    if (passwordWarn) {
      if (password) {
        return styles.formInputFilledWarn;
      }
      return styles.formInputWarn;
    }
    if (password) {
      return styles.formInputFilled;
    }
    return styles.formInput;
  };

  const nameUpdateHandler = (e) => setName(e.target.value);
  const passwordUpdateHandler = (e) => setPassword(e.target.value);
  const togglePasswordVisibility = () =>
    setPasswordVisibility(!isPasswordVisible);

  const signupHandler = async () => {
    if (nameWarn || passwordWarn) {
      return;
    }
    const res = await signup({
      _id: nanoid(),
      name,
      password,
    });
    if (res.message === "ok") {
      setUser(res.user);
      const projectId = nanoid();
      await createProject({
        _id: projectId,
        name: `Project name #1`,
        owner: res.user._id,
      });
      await createInitialTasks({ project: projectId });
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  const redirectHandler = () => {
    if (isUserLoaded && _id && !Cookies.get("ganttToken")) {
      router.reload();
    } else if (isUserLoaded && _id && currentProject) {
      router.push(`/gantt/${currentProject._id}`);
    }
  };

  useEffect(() => {
    redirectHandler();
  }, [isUserLoaded, _id, currentProject]);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When condition={isUserLoaded && !_id}>
        <DefaultGantt />
        <div className={styles.container} onClick={unsetWarnings}>
          <div className={styles.form}>
            <div className={styles.title}>Registration</div>
            <div className={styles.description}>
              Enter your information to register and to be
              <br /> able to use the service
            </div>
            <FloatingLabel
              id="name"
              name="name"
              placeholder="Your name"
              className={getNameInputClass()}
              value={name}
              onChange={nameUpdateHandler}
            />
            {nameWarn && (
              <div className={styles.warningContainer}>{nameWarn}</div>
            )}
            <div className={styles.passwordContainer}>
              <div
                className={styles.passwordEye}
                onClick={togglePasswordVisibility}
              >
                <Eye />
              </div>
              <FloatingLabel
                id="password"
                name="password"
                placeholder="Your password"
                className={getPasswordInputClass()}
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={passwordUpdateHandler}
              />
            </div>
            {passwordWarn && (
              <div className={styles.warningContainer}>{passwordWarn}</div>
            )}
            <div
              ref={registerBtn}
              className={styles.primaryButton}
              onClick={signupHandler}
            >
              Registration
            </div>
            <div className={styles.line}></div>
            <div className={styles.linkDescription}>
              Already have an account?
            </div>
            <Link href="/login">
              <a className={styles.link}>Sign in</a>
            </Link>
          </div>
        </div>
      </When>
    </>
  );
}
