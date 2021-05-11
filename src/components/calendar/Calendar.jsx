import { useState, useContext, memo } from "react";
import useEvent from "@react-hook/event";
import styles from "@/styles/calendar.module.scss";

import CalendarDay from "@/src/components/calendar/CalendarDay";
import CalendarWeek from "@/src/components/calendar/CalendarWeek";
import CalendarMonth from "@/src/components/calendar/CalendarMonth";

import { OptionsContext } from "@/src/context/OptionsContext";

function InnerCalendar({ isDefault, view }) {
  const [cursor, setCursor] = useState(null);
  const [isDraggable, setIsDraggable] = useState(false);

  const startDragHandler = () => {
    setCursor("pointer");
  };

  const removeDragHandler = () => {
    setCursor(null);
    document.body.style.cursor = "default";
    setIsDraggable(false);
  };

  useEvent(document, "keydown", (e) => {
    if (!cursor) {
      if (e.key == " ") {
        startDragHandler();
      }
    }
  });

  useEvent(document, "keyup", (e) => {
    if (e.key == " ") {
      removeDragHandler();
    }
  });

  useEvent(document, "mouseup", () => {
    removeDragHandler();
  });

  if (view == "Day") {
    return (
      <>
        <CalendarDay
          cursor={cursor}
          setCursor={setCursor}
          isDraggable={isDraggable}
          setDraggable={setIsDraggable}
          isDefault={isDefault}
        />
        <div className={styles.trackBackground}></div>
      </>
    );
  }
  if (view == "Week") {
    return (
      <>
        <CalendarWeek
          cursor={cursor}
          setCursor={setCursor}
          isDraggable={isDraggable}
          setDraggable={setIsDraggable}
        />
        <div className={styles.trackBackground}></div>
      </>
    );
  }
  if (view == "Month") {
    return (
      <>
        <CalendarMonth
          cursor={cursor}
          setCursor={setCursor}
          isDraggable={isDraggable}
          setDraggable={setIsDraggable}
        />
        <div className={styles.trackBackground}></div>
      </>
    );
  }
  return <></>;
}

InnerCalendar = memo(InnerCalendar);

export default function Calendar(props) {
  const { view } = useContext(OptionsContext);
  return <InnerCalendar {...{ ...props, view }} />;
}
