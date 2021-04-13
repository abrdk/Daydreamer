import { useState, useContext, memo } from "react";
import styles from "@/styles/viewSwitcher.module.scss";

import { OptionsContext } from "@/src/context/OptionsContext";

const modes = ["Day", "Week", "Month"];

function InnerViewSwitcher({ isMenuOpened, setView, isDefault }) {
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
        isMenuOpened && !isDefault
          ? styles.buttonsWrapper + " " + styles.offset
          : styles.buttonsWrapper
      }
    >
      {buttons}
    </div>
  );
}

InnerViewSwitcher = memo(
  InnerViewSwitcher,
  (prevProps, nextProps) =>
    prevProps.isMenuOpened == nextProps.isMenuOpened &&
    prevProps.isDefault == nextProps.isDefault
);

export default function ViewSwitcher({ isDefault }) {
  const { setView, isMenuOpened } = useContext(OptionsContext);
  return <InnerViewSwitcher {...{ setView, isMenuOpened, isDefault }} />;
}
