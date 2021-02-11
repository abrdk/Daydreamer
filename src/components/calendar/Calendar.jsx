import { useEffect, useState } from "react";

import CalendarDay from "@/src/components/calendar/CalendarDay";
import CalendarWeek from "@/src/components/calendar/CalendarWeek";

export default function Calendar({ view, position, isPositionOutside }) {
  const [cursor, setCursor] = useState(null);
  const [isDraggable, setDraggable] = useState(false);

  const setStartDragEventListener = () => {
    if (!cursor) {
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key == " ") {
            startDragHandler();
          } else {
            setStartDragEventListener();
          }
        },
        { once: true }
      );
    }
  };
  const setRemoveDragEventListener = () => {
    if (cursor == "pointer" || cursor == "grab") {
      document.addEventListener(
        "keyup",
        (e) => {
          console.log("e.key", e.key);
          if (e.key == " ") {
            removeDragHandler();
          } else {
            setRemoveDragEventListener();
          }
        },
        { once: true }
      );
    }
  };
  const setStopDragEventListener = () => {
    if (cursor == "grab") {
      document.addEventListener("mouseup", removeDragHandler, { once: true });
    }
  };

  const startDragHandler = () => {
    setCursor("pointer");
  };
  const removeDragHandler = () => {
    setCursor(null);
    document.body.style.cursor = "default";
    setDraggable(false);
  };
  const stopDragHandler = () => {
    setCursor("pointer");
    document.body.style.cursor = "default";
    setDraggable(false);
  };

  useEffect(() => {
    setStartDragEventListener();
    setRemoveDragEventListener();
    setStopDragEventListener();
  }, [cursor]);

  useEffect(() => {
    if (isPositionOutside && cursor == "grab") {
      stopDragHandler();
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
  if (view == "Week") {
    return (
      <CalendarWeek
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
