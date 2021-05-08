import { useContext, memo } from "react";
import styles from "@/styles/header.module.scss";
import { If, Then, Else } from "react-if";
import Truncate from "react-truncate";

import ViewSwitcher from "@/src/components/viewSwitcher/ViewSwitcher";
import CopyAndEditBtn from "@/src/components/header/CopyAndEditBtn";
import AvatarSvg from "@/src/components/svg/AvatarSvg";
import ShareSvg from "@/src/components/svg/ShareSvg";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerHeader({ setModal, userName, isUserOwnsProject }) {
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
              <span>Share Project</span>
              <ShareSvg />
            </button>
            <button
              className={styles.account_button}
              onClick={setModal.bind(null, "account")}
            >
              <AvatarSvg />{" "}
              <span>
                <Truncate lines={1} width={100}>
                  {userName}
                </Truncate>
              </span>
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

InnerHeader = memo(
  InnerHeader,
  (prevProps, nextProps) =>
    prevProps.userName == nextProps.userName &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject
);

export default function Header({ setModal }) {
  const { user } = useContext(UsersContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);

  return (
    <InnerHeader {...{ setModal, isUserOwnsProject, userName: user.name }} />
  );
}
