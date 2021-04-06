import { useState, useContext } from "react";
import styles from "@/styles/viewSwitcher.module.scss";

import { OptionsContext } from "@/src/context/OptionsContext";

const modes = ["Day", "Week", "Month"];

export default function ViewSwitcher() {
  const { setView, isMenuOpened } = useContext(OptionsContext);

  const [scale, setScale] = useState(0);

  const buttons = [0, 1, 2].map((i) => (
    <div
      key={i}
      className={scale === i ? styles.activeButton : styles.inactiveButton}
      onClick={() => {
        setScale(i);
        setView(modes[i]);
      }}
    >
      {modes[i]}
    </div>
  ));

  return (
    <div
      className={
        isMenuOpened
          ? styles.buttonsWrapper + " " + styles.offset
          : styles.buttonsWrapper
      }
    >
      {buttons}
    </div>
  );
}
