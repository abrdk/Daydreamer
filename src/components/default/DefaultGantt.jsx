import headerStyles from "@/styles/header.module.scss";
import menuStyles from "@/styles/menu.module.scss";
import Truncate from "react-truncate";
import ReactCursorPosition from "react-cursor-position";

import { ViewSwitcher } from "@/src/components/viewSwitcher/viewSwitcher";
import { ViewMode } from "@/src/types/public-types";
import Calendar from "@/src/components/calendar/Calendar";
import DefaultLines from "@/src/components/default/DefaultLines";

export default function DefaultGantt() {
  return (
    <>
      <div className={headerStyles.container} id="container">
        <div className={menuStyles.iconOpen}>
          <img src="/img/arrowRight.svg" alt="close" />
        </div>
        <div className={headerStyles.header}>
          <ViewSwitcher onViewModeChange={() => {}} />
          <div className={headerStyles.buttonsContainer}>
            <button className={headerStyles.share_button}>Share Project</button>
            <button className={headerStyles.account_button}>
              <img src="/img/avatar.svg" alt=" " />{" "}
              <Truncate lines={1} width={100}>
                John Smith
              </Truncate>
            </button>
          </div>
        </div>
      </div>
      <ReactCursorPosition>
        <Calendar view={ViewMode.Day} />
      </ReactCursorPosition>
      <DefaultLines />
      <img src="/img/plus.svg" alt=" " className={menuStyles.bigPlus} />
    </>
  );
}
