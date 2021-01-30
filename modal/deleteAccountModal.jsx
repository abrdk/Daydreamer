import modalStyles from "../styles/modal.module.css";
import globalStyles from "../styles/global.module.css";
import { xhr } from "../helpers/xhr";
import Router from "next/router";

export default function DeleteAccountModal({ setModal, token }) {
  const outsideClick = (e) => {
    if (e.target.id === "delete_account_wrapper") {
      setModal(false);
    }
  };

  const deleteQuery = () => {
    xhr(
      "/auth/delete",
      {
        token,
      },
      "DELETE"
    ).then((res) => {
      Router.push("/signup");
    });
  };
  return (
    <>
      <div className={modalStyles.modalBlock} />
      <div
        className={modalStyles.modalWrap}
        onClick={outsideClick}
        id="delete_account_wrapper"
      >
        <div className={modalStyles.deleteAccountModal}>
          <div>
            <div className={modalStyles.deleteAccountTitle}>Delete account</div>
            <div className={modalStyles.deleteAccountDescription}>
              Are you sure you want to <br />
              delete your account?
            </div>
            <div className={globalStyles.twoButtons}>
              <div
                className={modalStyles.deleteAccountSecondaryButton}
                onClick={setModal.bind(null, "account")}
              >
                No
              </div>
              <div
                className={modalStyles.deleteAccountPrimaryButton}
                onClick={deleteQuery}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
