import styles from "@/styles/account.module.scss";
import { Else, If, Then } from "react-if";

export default function AccountLink({
  setModal,
  isDataUpdating,
  isUpdatingComplete,
}) {
  return (
    <If condition={isDataUpdating() && !isUpdatingComplete}>
      <Then>
        <div className={styles.accountLinkDisabled}>Delete account</div>
      </Then>
      <Else>
        <div
          className={styles.accountLink}
          onClick={setModal.bind(null, "delete_account")}
        >
          Delete account
        </div>
      </Else>
    </If>
  );
}
