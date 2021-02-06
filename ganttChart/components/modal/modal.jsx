import AccountModal from "./accountModal";
import DeleteAccountModal from "./deleteAccountModal";
import ShareModal from "./shareModal";

export const Modal = ({ modal, setModal, id }) => {
  if (!modal) return null;

  if (modal === "share") {
    return <ShareModal setModal={setModal} />;
  }
  if (modal === "account") {
    return <AccountModal setModal={setModal} />;
  }

  if (modal === "delete_account") {
    return <DeleteAccountModal setModal={setModal} />;
  }

  return <></>;
};
