import { useState } from "react";
import { ViewMode } from "@/src/types/public-types.js";
import styles from "@/styles/viewSwitcher.module.scss";

const modes = ["Day", "Week", "Month"];

export const ViewSwitcher = ({ onViewModeChange, isMenuOpen }) => {
  const [scale, setScale] = useState(0);

  const buttons = [0, 1, 2].map((i) => (
    <div
      key={i}
      className={scale === i ? styles.activeButton : styles.inactiveButton}
      onClick={() => {
        setScale(i);
        onViewModeChange(ViewMode[modes[i]]);
      }}
    >
      {modes[i]}
    </div>
  ));

  return (
    <div
      className={
        isMenuOpen
          ? styles.buttonsWrapper + " " + styles.offset
          : styles.buttonsWrapper
      }
    >
      {buttons}
    </div>
  );
};
