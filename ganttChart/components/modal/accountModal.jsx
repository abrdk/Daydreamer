import Cookies from "js-cookie";
import { useState, useContext } from "react";
import modalStyles from "../../../styles/modal.module.css";
import homeStyles from "../../../styles/auth.module.css";
import globalStyles from "../../../styles/global.module.css";
import { xhr } from "../../../helpers/xhr";
import Router from "next/router";

import FloatingLabel from "floating-label-react";

import { UsersContext } from "../../context/users/UsersContext";

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
      Router.reload();
    } else if (isDataUpdating() && !isUpdatingComplete) {
      const res = await xhr(
        "/auth/update",
        {
          name,
          password,
        },
        "PUT"
      );
      if (res.message === "ok") {
        userCtx.setUser(res.user);
        setUpdateState(true);
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
      <div className={modalStyles.modalBlock} />
      <div
        className={modalStyles.modalWrap}
        onClick={outsideClick}
        id="account_wrapper"
      >
        <div
          className={modalStyles.accountModal}
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
              className={homeStyles.passwordEye}
              onClick={() => setPasswordVisibility(!isPasswordVisible)}
            />
          </div>
          {passwordWarn && (
            <div className={homteStyles.warn}>{passwordWarn}</div>
          )}
          <div
            className={
              isUpdatingComplete
                ? globalStyles.successButton
                : isDataUpdating()
                ? modalStyles.accountSecondaryButton
                : modalStyles.accountPrimaryButton
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
                ? modalStyles.accountLinkDisabled
                : modalStyles.accountLink
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
