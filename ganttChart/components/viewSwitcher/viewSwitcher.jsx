import { useState } from "react";
import { ViewMode } from "../../types/public-types";
import styles from "./viewSwitcher.module.css";

const modes = ["Day", "Week", "Month"];

export const ViewSwitcher = ({ onViewModeChange }) => {
  const [scale, setScale] = useState(0);

  const buttons = [0, 1, 2].map((i) => (
    <div
      className={scale === i ? styles.activeButton : styles.inactiveButton}
      onClick={() => {
        setScale(i);
        onViewModeChange(ViewMode[modes[i]]);
      }}
    >
      {modes[i]}
    </div>
  ));

  return <div className={styles.buttonsWrapper}>{buttons}</div>;
};
