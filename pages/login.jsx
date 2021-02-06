import Link from "next/link";
import { useState, useContext } from "react";
import { xhr } from "../helpers/xhr";
import Router from "next/router";
import styles from "../styles/auth.module.scss";
import { When } from "react-if";

import FloatingLabel from "floating-label-react";

import { UsersContext } from "../ganttChart/context/users/UsersContext";

export default function Login() {
  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const { isUserLoaded, _id } = useContext(UsersContext);

  const query = async () => {
    const res = await xhr(
      "/auth/login",
      {
        name,
        password,
      },
      "POST"
    );
    if (res.message === "ok") {
      Router.reload();
    } else {
      if (res.errorType === "name") {
        setNameWarn(res.message);
      } else if (res.errorType === "password") {
        setPasswordWarn(res.message);
      }
    }
  };

  return (
    <When condition={isUserLoaded && !_id}>
      <div
        className={styles.container}
        onClick={() => {
          setNameWarn(null);
          setPasswordWarn(null);
        }}
      >
        <div className={styles.form}>
          <div className={styles.title}>Sign in</div>
          <div className={styles.description}>
            Enter your information to sign in <br /> on the service
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
  );
}
