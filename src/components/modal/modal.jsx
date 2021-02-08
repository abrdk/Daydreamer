import AccountModal from "@/src/components/modal/accountModal";
import DeleteAccountModal from "@/src/components/modal/deleteAccountModal";
import ShareModal from "@/src/components/modal/shareModal";

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
