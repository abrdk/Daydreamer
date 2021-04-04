import { useState } from "react";
import useEvent from "@react-hook/event";

import CalendarDay from "@/src/components/calendar/CalendarDay";
import CalendarWeek from "@/src/components/calendar/CalendarWeek";
import CalendarMonth from "@/src/components/calendar/CalendarMonth";

export default function Calendar({ view, setMenu }) {
  const [cursor, setCursor] = useState(null);
  const [isDraggable, setDraggable] = useState(false);

  const startDragHandler = () => {
    setCursor("pointer");
  };

  const removeDragHandler = () => {
    setCursor(null);
    document.body.style.cursor = "default";
    setDraggable(false);
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
      <CalendarDay
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        view={view}
      />
    );
  }
  if (view == "Week") {
    return (
      <CalendarWeek
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        view={view}
      />
    );
  }
  if (view == "Month") {
    return (
      <CalendarMonth
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        view={view}
      />
    );
  }
  return <></>;
}
