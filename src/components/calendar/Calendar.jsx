import { useEffect, useState } from "react";

import CalendarDay from "@/src/components/calendar/CalendarDay";
import CalendarWeek from "@/src/components/calendar/CalendarWeek";
import CalendarMonth from "@/src/components/calendar/CalendarMonth";

export default function Calendar({
  view,
  position,
  isPositionOutside,
  setMenu,
  editedTask,
  setEditedTask,
}) {
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
        scrollAt={position.x}
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
        scrollAt={position.x}
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
