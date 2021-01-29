import { useState } from "react";
import modalStyles from "./modal.module.css";
import homeStyles from "../styles/Home.module.css";
import { xhr } from "../helpers/xhr";
import Link from "next/link";

import FloatingLabel from "floating-label-react";

export default function AccountModal({
  currentName,
  currentPassword,
  setModal,
}) {
  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState(currentName);
  const [password, setPassword] = useState(currentPassword);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const outsideClick = (e) => {
    if (e.target.id === "account_wrapper") {
      setModal(false);
    }
  };

  const query = () => {
    xhr(
      "/auth",
      {
        query: "login",
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
    <>
      <div className={modalStyles.modalBlock} />
      <div
        className={modalStyles.modalWrap}
        onClick={outsideClick}
        id="account_wrapper"
      >
        <div className={modalStyles.accountModal}>
          <div
            onClick={() => {
              setNameWarn(null);
              setPasswordWarn(null);
            }}
          >
            <div className={modalStyles.accountTitle}>Personal account</div>
            <FloatingLabel
              id="name"
              name="name"
              placeholder="Your name"
              className={
                nameWarn
                  ? name
                    ? homeStyles.formInputFilledWarn
                    : homeStyles.formInputWarn
                  : name
                  ? homeStyles.formInputFilled
                  : homeStyles.formInput
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameWarn && <div className={homeStyles.warn}>{nameWarn}</div>}
            <div className={homeStyles.passwordContainer}>
              <FloatingLabel
                id="password"
                name="password"
                placeholder="Your password"
                className={
                  passwordWarn
                    ? password
                      ? homeStyles.formInputFilledWarn
                      : homeStyles.formInputWarn
                    : password
                    ? homeStyles.formInputFilled
                    : homeStyles.formInput
                }
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src="/img/eye.svg"
                alt=" "
                className={homeStyles.eye}
                onClick={() => setPasswordVisibility(!isPasswordVisible)}
              />
            </div>
            {passwordWarn && (
              <div className={homeStyles.warn}>{passwordWarn}</div>
            )}
            <Link href="/logout">
              <div className={homeStyles.formButton}>Log out</div>
            </Link>
            <div className={modalStyles.deleteAccount}>Delete account</div>
          </div>
        </div>
      </div>
    </>
  );
}
