import Link from "next/link";
import { useState } from "react";
import styles from "../styles/modal.module.css";

import AccountModal from "./accountModal";
import DeleteAccountModal from "./deleteAccountModal";
import ShareModal from "./shareModal";

export const Modal = ({
  modal,
  setModal,
  request,
  chart,
  mapName,
  id,
  userName,
  password,
  token,
}) => {
  const [name, setName] = useState("");

  if (!modal) return null;

  const getLink = (id) => {
    const url = window.location.href.split("/");
    url[4] = id;
    return url.join("/");
  };

  if (modal === "share") {
    return <ShareModal setModal={setModal} link={getLink(id)} />;
  }
  if (modal === "account") {
    return (
      <AccountModal
        currentName={userName}
        currentPassword={password}
        setModal={setModal}
        token={token}
      />
    );
  }

  if (modal === "delete_account") {
    return <DeleteAccountModal setModal={setModal} token={token} />;
  }

  if (modal === "create")
    return (
      <>
        <div className={styles.modalBlock} />
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <img
              className={styles.modalCross}
              src="/img/cross.png"
              alt="cross"
              onClick={setModal.bind(null, false)}
            />
            <h4>Новый проект</h4>
            <label>
              <span>Название</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </label>
            <button
              onClick={() =>
                request({
                  query: "create",
                  chart,
                  name: name ? name : "Новый проект",
                })
              }
            >
              Создать
            </button>
          </div>
        </div>
      </>
    );

  if (modal === "loader")
    return (
      <>
        <div
          className={styles.modalBlock}
          style={{ backgroundColor: "#ffffff" }}
        />
        <div className={styles.modalWrap}>
          <img style={{ width: "85px" }} src="/img/loader.gif" alt="loader" />
        </div>
      </>
    );

  if (modal === "delete")
    return (
      <>
        <div className={styles.modalBlock} />
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <p style={{ color: "red", textAlign: "center" }}>
              Вы действительно хотите удалить - {mapName}?
            </p>
            <button
              onClick={() =>
                request({
                  query: "delete",
                  id,
                })
              }
            >
              Удалить
            </button>
            <button onClick={setModal.bind(null, false)}>Отмена</button>
          </div>
        </div>
      </>
    );

  return (
    <>
      {/* <div className={styles.modalBlock} />
      <div className={styles.modalWrap}>
        <div className={styles.modal}>
          <img
            className={styles.modalCross}
            src="/img/cross.png"
            alt="cross"
            onClick={setModal.bind(null, false)}
          />
          <h4>Ошибка</h4>
          <h4 style={{ color: "red" }}>{modal}</h4>
          <label>
            <span style={{ textAlign: "center" }}>
              Для продолжения работы необходима регистрация
            </span>
            <Link href="/signup">
              <button onClick={setModal.bind(null, false)}>Регистрация</button>
            </Link>
          </label>
        </div>
      </div> */}
    </>
  );
};
