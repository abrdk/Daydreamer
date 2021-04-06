import { useContext } from "react";
import styles from "@/styles/header.module.scss";
import { If, Then, Else } from "react-if";
import Truncate from "react-truncate";

import ViewSwitcher from "@/src/components/viewSwitcher/ViewSwitcher";
import CopyAndEditBtn from "@/src/components/header/CopyAndEditBtn";
import AvatarSvg from "@/src/components/svg/AvatarSvg";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function Header({ setModal }) {
  const { user } = useContext(UsersContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);

  return (
    <div className={styles.header}>
      <ViewSwitcher />
      <div className={styles.buttonsContainer}>
        <If condition={isUserOwnsProject}>
          <Then>
            <button
              className={styles.share_button}
              onClick={setModal.bind(null, "share")}
            >
              Share Project
            </button>
            <button
              className={styles.account_button}
              onClick={setModal.bind(null, "account")}
            >
              <AvatarSvg />{" "}
              <Truncate lines={1} width={100}>
                {user.name}
              </Truncate>
            </button>
          </Then>
          <Else>
            <CopyAndEditBtn setModal={setModal} />
          </Else>
        </If>
      </div>
    </div>
  );
}
