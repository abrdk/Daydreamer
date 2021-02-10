import { useEffect, useState } from "react";

import CalendarDay from "@/src/components/calendar/CalendarDay";

export default function Calendar({ view, position, isPositionOutside }) {
  const [cursor, setCursor] = useState(null);
  const [isDraggable, setDraggable] = useState(false);

  const startDragHandler = (e) => {
    setCursor("pointer");
  };
  const stopDragHandler = (e) => {
    setCursor(null);
    document.body.style.cursor = "default";
    setDraggable(false);
  };
  const unsetDragHandler = () => {
    setCursor("pointer");
    document.body.style.cursor = "default";
    setDraggable(false);
  };

  useEffect(() => {
    if (!cursor) {
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key == " ") {
            startDragHandler(e);
          }
        },
        { once: true }
      );
      document.addEventListener(
        "keyup",
        (e) => {
          if (e.key == " ") {
            stopDragHandler(e);
          }
        },
        { once: true }
      );
    } else if (cursor == "grab") {
      document.addEventListener("mouseup", unsetDragHandler, { once: true });
    }
  }, [cursor]);

  useEffect(() => {
    if (isPositionOutside && cursor) {
      unsetDragHandler();
    }
  }, [isPositionOutside]);

  if (view == "Day") {
    return (
      <CalendarDay
        scrollAt={position.x}
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
      />
    );
  }
  return <></>;
}
