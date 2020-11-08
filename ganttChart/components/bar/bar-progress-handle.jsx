import React from "react";
import styles from "./bar.module.css";

export const BarProgressHandle = ({
  progressPoint,
  onMouseDown,
}) => {
  return (
    <polygon
      className={styles.barHandle}
      points={progressPoint}
      onMouseDown={onMouseDown}
    />
  );
};
