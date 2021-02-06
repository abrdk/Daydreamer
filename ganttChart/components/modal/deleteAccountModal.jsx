import styles from "../../../styles/deleteAccount.module.scss";
import { xhr } from "../../../helpers/xhr";
import Router from "next/router";
import { useContext } from "react";

import { ProjectsContext } from "../../context/projects/ProjectsContext";
import { TasksContext } from "../../context/tasks/TasksContext";

export default function DeleteAccountModal({ setModal }) {
  const { deleteAllProjects } = useContext(ProjectsContext);
  const { deleteAllTasks } = useContext(TasksContext);

  const outsideClick = (e) => {
    if (e.target.id === "delete_account_wrapper") {
      setModal(false);
    }
  };

  const deleteQuery = async () => {
    await Promise.all([
      deleteAllTasks(),
      deleteAllProjects(),
      xhr("/auth/delete", {}, "DELETE"),
    ]);
    Router.reload();
  };

  return (
    <>
      <div className={styles.modalBlock} />
      <div
        className={styles.modalWrap}
        onClick={outsideClick}
        id="delete_account_wrapper"
      >
        <div className={styles.deleteAccountModal}>
          <div>
            <div className={styles.deleteAccountTitle}>Delete account</div>
            <div className={styles.deleteAccountDescription}>
              Are you sure you want to <br />
              delete your account?
            </div>
            <div className={styles.twoButtons}>
              <div
                className={styles.deleteAccountSecondaryButton}
                onClick={setModal.bind(null, "account")}
              >
                No
              </div>
              <div
                className={styles.deleteAccountPrimaryButton}
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
