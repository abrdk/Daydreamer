import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/auth.module.scss";
import { When } from "react-if";
import FloatingLabel from "floating-label-react";

import DefaultGantt from "@/src/components/default/DefaultGantt";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function Login() {
  const router = useRouter();

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { isUserLoaded, _id, login } = useContext(UsersContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject && projects.length) {
    currentProject = projects[0];
  }

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

  const loginHandler = async () => {
    const res = await login({
      name,
      password,
    });
    if (res.message === "ok") {
      router.reload();
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  const redirectHandler = () => {
    if (isUserLoaded && _id && currentProject) {
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
            <div className={styles.title}>Sign in</div>
            <div className={styles.description}>
              Enter your information to sign in <br /> on the service
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
            <div className={styles.primaryButton} onClick={loginHandler}>
              Sign in
            </div>
            <div className={styles.line}></div>
            <div className={styles.linkDescription}>
              Don't have an account yet?
            </div>
            <Link href="/signup">
              <a className={styles.link}>Registration</a>
            </Link>
          </div>
        </div>
      </When>
    </>
  );
}
