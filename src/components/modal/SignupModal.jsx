import Head from "next/head";
import Link from "next/link";
import { useState, useRef } from "react";
import styles from "@/styles/auth.module.scss";

import NameForm from "@/src/components/auth/NameForm";
import PasswordForm from "@/src/components/auth/PasswordForm";
import RegisterBtn from "@/src/components/modal/SignupModal/RegisterBtn";

export default function SignupModal({ setModal }) {
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const unsetWarnings = (e) => {
    if (e.target != registerBtnRef.current) {
      setNameWarn(null);
      setPasswordWarn(null);
    }
  };

  const closeModal = (e) => {
    if (e.target == containerRef.current) {
      setModal(null);
    }
  };

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <div className={styles.container} ref={containerRef} onClick={closeModal}>
        <div className={styles.form} onClick={unsetWarnings}>
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
            setModal={setModal}
          />
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
