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

  const unsetWarnings = () => {
    setNameWarn(null);
    setPasswordWarn(null);
  };

  const getNameInputClass = () => {
    if (nameWarn) {
      if (name) {
        return authStyles.formInputFilledWarn;
      }
      return authStyles.formInputWarn;
    }
    if (name) {
      return authStyles.formInputFilled;
    }
    return authStyles.formInput;
  };

  const getPasswordInputClass = () => {
    if (passwordWarn) {
      if (password) {
        return authStyles.formInputFilledWarn;
      }
      return authStyles.formInputWarn;
    }
    if (password) {
      return authStyles.formInputFilled;
    }
    return authStyles.formInput;
  };

  const updateNameHandler = (e) => setName(e.target.value);
  const updatePasswordHandler = (e) => setPassword(e.target.value);

  const isDataUpdating = () =>
    !(name === userCtx.name && password === userCtx.password);

  const togglePasswordVisibility = () =>
    setPasswordVisibility(!isPasswordVisible);

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
        <div className={styles.accountModal} onClick={unsetWarnings}>
          <div className={styles.accountTitle}>Personal account</div>
          <FloatingLabel
            id="name"
            name="name"
            placeholder="Your name"
            className={getNameInputClass()}
            value={name}
            onChange={updateNameHandler}
          />
          {nameWarn && (
            <div className={authStyles.warningContainer}>{nameWarn}</div>
          )}
          <div className={authStyles.passwordContainer}>
            <FloatingLabel
              id="password"
              name="password"
              placeholder="Your password"
              className={getPasswordInputClass()}
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={updatePasswordHandler}
            />
            <img
              src="/img/eye.svg"
              alt=" "
              className={authStyles.passwordEye}
              onClick={togglePasswordVisibility}
            />
          </div>
          {passwordWarn && (
            <div className={authStyles.warningContainer}>{passwordWarn}</div>
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
