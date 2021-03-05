import Head from "next/head";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState, useContext, useRef } from "react";
import styles from "@/styles/auth.module.scss";
import { useRouter } from "next/router";
import FloatingLabel from "floating-label-react";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function SignupModal({ setModal }) {
  const router = useRouter();
  const container = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { setUser, signup } = useContext(UsersContext);
  const { createProject, projectByQueryId } = useContext(ProjectsContext);
  const { createTask, tasksByProjectId } = useContext(TasksContext);

  const unsetWarnings = () => {
    setNameWarn(null);
    setPasswordWarn(null);
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
  const closeModal = (e) => {
    if (e.target == container.current) {
      setModal(null);
    }
  };

  const copyProject = async (res) => {
    const newProjectId = nanoid();
    await createProject({
      _id: newProjectId,
      name: projectByQueryId.name,
      owner: res.user._id,
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
          owner: res.user._id,
          root: new_ids[old_ids.indexOf(t.root)],
        };
      } else {
        return {
          ...t,
          _id: new_ids[i],
          project: newProjectId,
          owner: res.user._id,
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
    setModal(null);
  };

  const signupHandler = async () => {
    const res = await signup({
      _id: nanoid(),
      name,
      password,
    });
    if (res.message === "ok") {
      setUser(res.user);
      await copyProject(res);
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <div className={styles.container} ref={container} onClick={closeModal}>
        <div className={styles.form} onClick={unsetWarnings}>
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
            <FloatingLabel
              id="password"
              name="password"
              placeholder="Your password"
              className={getPasswordInputClass()}
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={passwordUpdateHandler}
            />
            <img
              src="/img/eye.svg"
              alt=" "
              className={styles.passwordEye}
              onClick={togglePasswordVisibility}
            />
          </div>
          {passwordWarn && (
            <div className={styles.warningContainer}>{passwordWarn}</div>
          )}
          <div className={styles.primaryButton} onClick={signupHandler}>
            Registration
          </div>
          <div className={styles.line}></div>
          <div className={styles.linkDescription}>Already have an account?</div>
          <Link href="/login">
            <a className={styles.link}>Sign in</a>
          </Link>
        </div>
      </div>
    </>
  );
}
