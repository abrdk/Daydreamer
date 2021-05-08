import headerStyles from "@/styles/header.module.scss";
import menuStyles from "@/styles/menu.module.scss";
import Truncate from "react-truncate";

import ViewSwitcher from "@/src/components/viewSwitcher/ViewSwitcher";

import AvatarSvg from "@/src/components/svg/AvatarSvg";
import PlusSvg from "@/src/components/svg/PlusSvg";
import ArrowRightSvg from "@/src/components/svg/ArrowRightSvg";
import ShareSvg from "@/src/components/svg/ShareSvg";

export default function DefaultHeader() {
  return (
    <>
      <div className={headerStyles.container} id="container">
        <div className={menuStyles.iconOpen}>
          <ArrowRightSvg />
        </div>
        <div className={headerStyles.header}>
          <div>
            <ViewSwitcher isDefault />
          </div>
          <div className={headerStyles.buttonsContainer}>
            <button className={headerStyles.share_button}>
              <span>Share Project</span>
              <ShareSvg />
            </button>
            <button className={headerStyles.account_button}>
              <AvatarSvg />
              <Truncate lines={1} width={100}>
                John Smith
              </Truncate>
            </button>
          </div>
        </div>
      </div>
      <div className={menuStyles.bigPlus}>
        <PlusSvg />
      </div>
    </>
  );
}
