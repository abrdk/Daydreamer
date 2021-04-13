import { useState, useContext, useRef } from "react";
import styles from "@/styles/account.module.scss";

import NameForm from "@/src/components/auth/NameForm";
import PasswordForm from "@/src/components/auth/PasswordForm";
import AccountBtn from "@/src/components/modal/AccountModal/AccountBtn";
import AccountLink from "@/src/components/modal/AccountModal/AccountLink";

import { UsersContext } from "@/src/context/UsersContext";

export default function AccountModal({ setModal }) {
  const { user } = useContext(UsersContext);

  const saveBtnRef = useRef(null);
  const accountWrapperRef = useRef(null);

  const [nameWarn, setNameWarn] = useState("");
  const [passwordWarn, setPasswordWarn] = useState("");

  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(user.password);

  const [isUpdatingComplete, setIsUpdatingComplete] = useState(false);

  const outsideClick = (e) => {
    if (e.target == accountWrapperRef.current) {
      setModal(false);
    }
  };

  const unsetWarnings = (e) => {
    if (e.target != saveBtnRef.current) {
      setNameWarn(null);
      setPasswordWarn(null);
    }
  };

  const isDataUpdating = () =>
    !(name === user.name && password === user.password && user._id != "");

  return (
    <>
      <div className={styles.modalBlock} />
      <div
        className={styles.modalWrap}
        onClick={outsideClick}
        ref={accountWrapperRef}
      >
        <div className={styles.accountModal} onClick={unsetWarnings}>
          <div className={styles.accountTitle}>Personal account</div>
          <NameForm name={name} setName={setName} nameWarn={nameWarn} />
          <PasswordForm
            password={password}
            setPassword={setPassword}
            passwordWarn={passwordWarn}
          />
          <AccountBtn
            name={name}
            password={password}
            nameWarn={nameWarn}
            passwordWarn={passwordWarn}
            setNameWarn={setNameWarn}
            setPasswordWarn={setPasswordWarn}
            isUpdatingComplete={isUpdatingComplete}
            setIsUpdatingComplete={setIsUpdatingComplete}
            saveBtnRef={saveBtnRef}
          />
          <AccountLink
            setModal={setModal}
            isDataUpdating={isDataUpdating}
            isUpdatingComplete={isUpdatingComplete}
          />
        </div>
      </div>
    </>
  );
}
