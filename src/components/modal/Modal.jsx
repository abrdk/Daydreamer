import AccountModal from "@/src/components/modal/AccountModal";
import DeleteAccountModal from "@/src/components/modal/DeleteAccountModal";
import ShareModal from "@/src/components/modal/ShareModal";
import SignupModal from "@/src/components/modal/SignupModal";

export const Modal = ({ modal, setModal }) => {
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
  if (modal === "signup") {
    return <SignupModal setModal={setModal} />;
  }

  return <></>;
};
