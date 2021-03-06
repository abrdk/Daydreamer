import { useState } from "react";
import useEvent from "@react-hook/event";
import useMouse from "@react-hook/mouse-position";

import CalendarDay from "@/src/components/calendar/CalendarDay";
import CalendarWeek from "@/src/components/calendar/CalendarWeek";
import CalendarMonth from "@/src/components/calendar/CalendarMonth";

export default function Calendar({ view, setMenu, editedTask, setEditedTask }) {
  const [cursor, setCursor] = useState(null);
  const [isDraggable, setDraggable] = useState(false);

  const mouse = useMouse(document.querySelector("#__next"), {
    enterDelay: 100,
    leaveDelay: 100,
  });

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

  useEvent(document, "mouseup", (e) => {
    removeDragHandler();
  });

  if (view == "Day") {
    return (
      <CalendarDay
        scrollAt={mouse.x}
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        view={view}
      />
    );
  }
  if (view == "Week") {
    return (
      <CalendarWeek
        scrollAt={mouse.x}
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        view={view}
      />
    );
  }
  if (view == "Month") {
    return (
      <CalendarMonth
        scrollAt={mouse.x}
        cursor={cursor}
        setCursor={setCursor}
        isDraggable={isDraggable}
        setDraggable={setDraggable}
        setMenu={setMenu}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        view={view}
      />
    );
  }
  return <></>;
}
