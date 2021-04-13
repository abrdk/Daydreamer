import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useRef } from "react";
import styles from "@/styles/auth.module.scss";
import { When } from "react-if";

import DefaultGanttBackground from "@/src/components/default/DefaultGanttBackground";
import NameForm from "@/src/components/auth/NameForm";
import PasswordForm from "@/src/components/auth/PasswordForm";
import LoginBtn from "@/src/components/auth/LoginBtn";

import { UsersContext } from "@/src/context/UsersContext";

export default function Login() {
  const loginBtnRef = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { isUserLoaded, user } = useContext(UsersContext);

  const unsetWarnings = (e) => {
    if (e.target != loginBtnRef.current) {
      setNameWarn(null);
      setPasswordWarn(null);
    }
  };

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <When condition={isUserLoaded && !user._id}>
        <DefaultGanttBackground />
        <div className={styles.container} onClick={unsetWarnings}>
          <div className={styles.form}>
            <div className={styles.title}>Sign in</div>
            <div className={styles.description}>
              Enter your information to sign in <br /> on the service
            </div>
            <NameForm name={name} setName={setName} nameWarn={nameWarn} />
            <PasswordForm
              password={password}
              setPassword={setPassword}
              passwordWarn={passwordWarn}
            />
            <LoginBtn
              name={name}
              password={password}
              nameWarn={nameWarn}
              passwordWarn={passwordWarn}
              setNameWarn={setNameWarn}
              setPasswordWarn={setPasswordWarn}
              loginBtnRef={loginBtnRef}
            />
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
