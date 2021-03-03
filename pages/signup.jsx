import Cookies from "js-cookie";
import Head from "next/head";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import styles from "@/styles/auth.module.scss";
import { useRouter } from "next/router";
import { When } from "react-if";
import FloatingLabel from "floating-label-react";

import DefaultGantt from "@/src/components/default/DefaultGantt";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Signup() {
  const router = useRouter();

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

  const query = async () => {
    const res = await signup({
      _id: nanoid(),
      name,
      password,
    });
    if (res.message === "ok") {
      setUser(res.user);
      const projectId = nanoid();
      await Promise.all([
        createProject({
          _id: projectId,
          name: `Project name #1`,
        }),
        createInitialTasks({ project: projectId }),
      ]);

      router.reload();
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  useEffect(() => {
    if (isUserLoaded && _id && !Cookies.get("ganttToken")) {
      router.reload();
    } else if (isUserLoaded && _id && currentProject) {
      router.push(`/gantt/${currentProject._id}`);
    }
  }, [isUserLoaded, _id, currentProject]);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When condition={isUserLoaded && !_id && !Cookies.get("ganttToken")}>
        <DefaultGantt />
        <div
          className={styles.container}
          onClick={() => {
            setNameWarn(null);
            setPasswordWarn(null);
          }}
        >
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
              className={
                nameWarn
                  ? name
                    ? styles.formInputFilledWarn
                    : styles.formInputWarn
                  : name
                  ? styles.formInputFilled
                  : styles.formInput
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameWarn && <div className={styles.warn}>{nameWarn}</div>}
            <div className={styles.passwordContainer}>
              <FloatingLabel
                id="password"
                name="password"
                placeholder="Your password"
                className={
                  passwordWarn
                    ? password
                      ? styles.formInputFilledWarn
                      : styles.formInputWarn
                    : password
                    ? styles.formInputFilled
                    : styles.formInput
                }
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src="/img/eye.svg"
                alt=" "
                className={styles.passwordEye}
                onClick={() => setPasswordVisibility(!isPasswordVisible)}
              />
            </div>
            {passwordWarn && <div className={styles.warn}>{passwordWarn}</div>}
            <div className={styles.primaryButton} onClick={query}>
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
