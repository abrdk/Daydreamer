import { useState, useEffect, memo } from "react";
import styles from "@/styles/projectsDropdown.module.scss";

import PencilSvg from "@/src/components/svg/PencilSvg";

const pencilOffsetLeft = 18;

function OptionPencil({
  projectName,
  isNameUpdating,
  setIsNameUpdating,
  inputRef,
  pencilIconRef,
  hiddenTextRef,
}) {
  const [pencilLeft, setPencilLeft] = useState(0);

  const startOrStopNameUpdate = (e) => {
    e.stopPropagation();
    if (!isNameUpdating) {
      setIsNameUpdating(true);
    } else if (e.target != inputRef.current) {
      setIsNameUpdating(false);
    }
  };

  const getPencilLeft = () => {
    if (hiddenTextRef.current) {
      const textWidth = hiddenTextRef.current.offsetWidth;
      if (textWidth + pencilOffsetLeft > 315) {
        return 315;
      }
      return textWidth + pencilOffsetLeft;
    }
  };

  useEffect(() => {
    setPencilLeft(getPencilLeft());
  }, [projectName, isNameUpdating]);

  return (
    <div
      style={{
        left: pencilLeft,
      }}
      className={styles.pencilContainer}
      onClick={startOrStopNameUpdate}
    >
      <div className={styles.pencil} ref={pencilIconRef}>
        <PencilSvg />
      </div>
    </div>
  );
}

OptionPencil = memo(
  OptionPencil,
  (prevProps, nextProps) =>
    prevProps.projectName == nextProps.projectName &&
    prevProps.isNameUpdating == nextProps.isNameUpdating
);

export default OptionPencil;
