import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import "../styles/Home.module.css";
import { xhr } from "../helpers/xhr";
import Router from "next/router";

import FloatingLabel from "floating-label-react";

export default function Signup(props) {
  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const query = () => {
    xhr(
      "/auth",
      {
        query: "signup",
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
        <div className={styles.formTitle}>Registration</div>
        <div className={styles.formDescription}>
          Enter your information to register and to be able to use the service
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
        {passwordWarn && <div className={styles.warn}>{passwordWarn}</div>}
        <div className={styles.formButton} onClick={query}>
          Registration
        </div>
        <div className={styles.line}></div>
        <div className={styles.loginDescription}>Already have an account?</div>
        <Link href="/login">
          <a className={styles.loginLink}>Sign in</a>
        </Link>
      </div>
    </div>
  );
}

Signup.getInitialProps = async ({ req, res }) => {
  let user;

  try {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {}

  if (user) {
    res.writeHead(302, { Location: "gantt/new" });
    res.end();
  }

  return {};
};
