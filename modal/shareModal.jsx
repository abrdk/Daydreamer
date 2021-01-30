import styles from "../styles/modal.module.css";

export default function ShareModal({ setModal, link }) {
  const copyLink = (e) => {
    document.querySelector("#link").select();
    document.execCommand("copy");
  };

  const outsideClick = (e) => {
    if (e.target.id === "share_wrapper") {
      setModal(false);
    }
  };

  return (
    <>
      <div className={styles.modalBlock} />
      <div
        className={styles.modalWrap}
        onClick={outsideClick}
        id="share_wrapper"
      >
        <div className={styles.shareModal}>
          <h4 className={styles.shareTitle}>Share project</h4>
          <form className={styles.shareForm}>
            <label>Your link</label>
            <input
              type="text"
              id="link"
              readOnly={true}
              value={link}
              onMouseDown={copyLink}
            />
          </form>
          <div
            className={styles.sharePrimaryButton}
            onClick={(e) => {
              copyLink(e);
              setModal(false);
            }}
          >
            Copy link
          </div>
        </div>
      </div>
    </>
  );
}
