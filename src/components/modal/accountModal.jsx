import Cookies from "js-cookie";
import { useState, useContext } from "react";
import styles from "@/styles/account.module.scss";
import authStyles from "@/styles/auth.module.scss";
import baseStyles from "@/styles/base.module.scss";
import Router from "next/router";
import FloatingLabel from "floating-label-react";

import { UsersContext } from "@/src/context/users/UsersContext";

export default function AccountModal({ setModal }) {
  const userCtx = useContext(UsersContext);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState(userCtx.name);
  const [password, setPassword] = useState(userCtx.password);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const [isUpdatingComplete, setUpdateState] = useState(false);

  const outsideClick = (e) => {
    if (e.target.id === "account_wrapper") {
      setModal(false);
    }
  };

  const isDataUpdating = () =>
    !(name === userCtx.name && password === userCtx.password);

  const updateHandler = async () => {
    if (!isDataUpdating() && !isUpdatingComplete) {
      Cookies.remove("ganttToken", { path: "/" });
      Router.push("/signup");
    } else if (isDataUpdating() && !isUpdatingComplete) {
      const res = await userCtx.updateUser({
        name,
        password,
      });
      if (res.message === "ok") {
        userCtx.setUser(res.user);
        setUpdateState(true);
        setTimeout(() => setUpdateState(false), 1000);
      } else {
        if (res.errorType === "name") {
          setNameWarn(res.message);
        } else if (res.errorType === "password") {
          setPasswordWarn(res.message);
        }
      }
    }
  };

  return (
    <>
      <div className={styles.modalBlock} />
      <div
        className={styles.modalWrap}
        onClick={outsideClick}
        id="account_wrapper"
      >
        <div
          className={styles.accountModal}
          onClick={() => {
            setNameWarn(null);
            setPasswordWarn(null);
          }}
        >
          <div className={styles.accountTitle}>Personal account</div>
          <FloatingLabel
            id="name"
            name="name"
            placeholder="Your name"
            className={
              nameWarn
                ? name
                  ? authStyles.formInputFilledWarn
                  : authStyles.formInputWarn
                : name
                ? authStyles.formInputFilled
                : authStyles.formInput
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameWarn && <div className={authStyles.warn}>{nameWarn}</div>}
          <div className={authStyles.passwordContainer}>
            <FloatingLabel
              id="password"
              name="password"
              placeholder="Your password"
              className={
                passwordWarn
                  ? password
                    ? authStyles.formInputFilledWarn
                    : authStyles.formInputWarn
                  : password
                  ? authStyles.formInputFilled
                  : authStyles.formInput
              }
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src="/img/eye.svg"
              alt=" "
              className={authStyles.passwordEye}
              onClick={() => setPasswordVisibility(!isPasswordVisible)}
            />
          </div>
          {passwordWarn && (
            <div className={homteStyles.warn}>{passwordWarn}</div>
          )}
          <div
            className={
              isUpdatingComplete
                ? baseStyles.successButton
                : isDataUpdating()
                ? styles.accountSecondaryButton
                : styles.accountPrimaryButton
            }
            onClick={updateHandler}
          >
            {isUpdatingComplete
              ? "Your data was changed"
              : isDataUpdating()
              ? "Save data"
              : "Log out"}
          </div>
          <div
            className={
              isDataUpdating() && !isUpdatingComplete
                ? styles.accountLinkDisabled
                : styles.accountLink
            }
            onClick={
              isDataUpdating() && !isUpdatingComplete
                ? null
                : setModal.bind(null, "delete_account")
            }
          >
            Delete account
          </div>
        </div>
      </div>
    </>
  );
}
