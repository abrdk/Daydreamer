import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useRef, useEffect } from "react";
import styles from "@/styles/auth.module.scss";
import { When } from "react-if";

import DefaultGanttBackground from "@/src/components/default/DefaultGanttBackground";
import NameForm from "@/src/components/auth/NameForm";
import PasswordForm from "@/src/components/auth/PasswordForm";
import RegisterBtn from "@/src/components/auth/RegisterBtn";

import { UsersContext } from "@/src/context/UsersContext";

export default function Signup() {
  const registerBtnRef = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { isUserLoaded, user } = useContext(UsersContext);

  const unsetWarnings = (e) => {
    if (e.target != registerBtnRef.current) {
      setNameWarn(null);
      setPasswordWarn(null);
    }
  };

  useEffect(() => {
    var customViewportCorrectionVariable = "vh";
    function setViewportProperty(doc) {
      var prevClientHeight;
      var customVar = "--" + (customViewportCorrectionVariable || "vh");
      function handleResize() {
        var clientHeight = doc.clientHeight;
        if (clientHeight === prevClientHeight) return;
        requestAnimationFrame(function updateViewportHeight() {
          doc.style.setProperty(customVar, clientHeight * 0.01 + "px");
          prevClientHeight = clientHeight;
        });
      }
      handleResize();
      return handleResize;
    }
    window.addEventListener(
      "resize",
      setViewportProperty(document.documentElement)
    );
  }, []);

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
        content="width=device-width, initial-scale=1"
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <When condition={isUserLoaded && !user._id}>
        <DefaultGanttBackground />
        <div className={styles.container} onClick={unsetWarnings}>
          <div className={styles.form}>
            <div className={styles.title}>Registration</div>
            <div className={styles.description}>
              Enter your information to register and to be
              <br className={styles.descriptionBr} /> able to use the service
            </div>
            <NameForm name={name} setName={setName} nameWarn={nameWarn} />
            <PasswordForm
              password={password}
              setPassword={setPassword}
              passwordWarn={passwordWarn}
            />
            <RegisterBtn
              name={name}
              password={password}
              nameWarn={nameWarn}
              passwordWarn={passwordWarn}
              setNameWarn={setNameWarn}
              setPasswordWarn={setPasswordWarn}
              registerBtnRef={registerBtnRef}
            />
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
