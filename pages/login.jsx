import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

import Link from "next/link";
import { useState } from "react";
import { xhr } from "../helpers/xhr";
import Router from "next/router";
import styles from "../styles/Home.module.css";

import FloatingLabel from "floating-label-react";

export default function Login() {
  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const query = () => {
    xhr(
      "/auth/login",
      {
        name,
        password,
      },
      "POST"
    ).then((res) => {
      if (res.message === "ok") {
        Router.push("/gantt/new");
      } else {
        if (res.errorType === "name") {
          setNameWarn(res.message);
        } else if (res.errorType === "password") {
          setPasswordWarn(res.message);
        }
      }
    });
  };

  return (
    <div
      className={styles.container}
      onClick={() => {
        setNameWarn(null);
        setPasswordWarn(null);
      }}
    >
      <div className={styles.form}>
        <div className={styles.formTitle}>Sign in</div>
        <div className={styles.formDescription}>
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
            className={styles.eye}
            onClick={() => setPasswordVisibility(!isPasswordVisible)}
          />
        </div>
        {passwordWarn && <div className={styles.warn}>{passwordWarn}</div>}
        <div className={styles.formButton} onClick={query}>
          Sign in
        </div>
        <div className={styles.line}></div>
        <div className={styles.loginDescription}>
          Don't have an account yet?
        </div>
        <Link href="/signup">
          <a className={styles.loginLink}>Registration</a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  let user;

  try {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {}

  if (user) {
    return {
      redirect: {
        destination: "/gantt/new",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
