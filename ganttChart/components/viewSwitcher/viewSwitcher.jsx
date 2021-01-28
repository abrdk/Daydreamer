import { useState } from "react";
import { ViewMode } from "../../types/public-types";
import styles from "./viewSwitcher.module.css";

const modes = ["Day", "Week", "Month"];

export const ViewSwitcher = ({ onViewModeChange }) => {
  const [scale, setScale] = useState(1);

  return (
    <div className={styles.buttonsWrapper}>
      <div
        className={scale === 0 ? styles.activeButton : styles.inactiveButton}
        onClick={() => {
          setScale(0);
          onViewModeChange(ViewMode[modes[0]]);
        }}
      >
        {modes[0]}
      </div>
      <div
        className={scale === 1 ? styles.activeButton : styles.inactiveButton}
        onClick={() => {
          setScale(1);
          onViewModeChange(ViewMode[modes[1]]);
        }}
      >
        {modes[1]}
      </div>
      <div
        className={scale === 2 ? styles.activeButton : styles.inactiveButton}
        onClick={() => {
          setScale(2);
          onViewModeChange(ViewMode[modes[2]]);
        }}
      >
        {modes[2]}
      </div>
    </div>
  );
};
