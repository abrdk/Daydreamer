import styles from "@/styles/share.module.scss";

export default function ShareModal({ setModal }) {
  const copyLink = () => {
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
              value={window.location.href}
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
