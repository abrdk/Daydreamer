import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import useEvent from "@react-hook/event";
import useMedia from "use-media";

export default function CalendarMonth({
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  calendarStartDate,
  setCalendarStartDate,
  calendarEndDate,
  setCalendarEndDate,
  children,
}) {
  const isMobile = useMedia({ maxWidth: 1200 });

  const [isMouseDown, setIsMouseDown] = useState(false);
  useEvent(document, "mousedown", () => setIsMouseDown(true));
  useEvent(document, "mouseup", () => {
    setIsMouseDown(false);
    document.querySelector(".Calendar-Scroller").style.userSelect = "auto";
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  });

  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const startScrollHandler = (e) => {
    if (cursor == "pointer") {
      setInitialScrollLeft(e.clientX);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
      document.querySelector(".Calendar-Scroller").style.userSelect = "none";
    }
  };

  const stopScrollHandler = (scrollValues) => {
    if (!isMouseDown) {
      const monthWidth = 160;
      if (scrollValues.scrollLeft < monthWidth) {
        document.querySelector(".Calendar-Scroller").scrollBy(160 * 12, 0);
        setCalendarStartDate(
          new Date(calendarStartDate.getFullYear() - 1, 0, 1)
        );
        document.querySelector("#linesWrapper").style.paddingLeft =
          160 * 12 + "px";
      } else if (
        scrollValues.contentScrollWidth -
          scrollValues.clientWidth -
          scrollValues.scrollLeft <
        monthWidth
      ) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear() + 1,
            11,
            daysInMonth(calendarEndDate.getFullYear() + 1, 11),
            23,
            59,
            59
          )
        );
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const calculatedDefaultScrollLeft =
      window.innerWidth < 1200
        ? (numOfMonths(calendarStartDate, today) - 2) * 91
        : (numOfMonths(calendarStartDate, today) - 4) * 160;
    if (calculatedDefaultScrollLeft > 0) {
      document
        .querySelector(".Calendar-Scroller")
        .scrollBy(calculatedDefaultScrollLeft, 0);
    }
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  }, []);

  const scrollByMouse = (e) => {
    try {
      e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
    } catch (e) {}
    document
      .querySelector(".Calendar-Scroller")
      .scrollBy(-e.clientX + initialScrollLeft, 0);
    setInitialScrollLeft(e.clientX);
  };

  useEvent(document, "mousemove", (e) => {
    if (isDraggable) {
      scrollByMouse(e);
    }
  });

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      noScrollY={true}
      style={{
        height: isMobile
          ? "calc(calc(var(--vh, 1vh) * 100) - 72px)"
          : "calc(calc(var(--vh, 1vh) * 100) - 89px)",
        width: "100vw",
      }}
      trackXProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return (
            <span
              {...restProps}
              ref={elementRef}
              className="ScrollbarsCustom-Track ScrollbarsCustom-TrackX ScrollbarsCustom-Calendar"
            />
          );
        },
      }}
      scrollerProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return (
            <div
              {...restProps}
              ref={elementRef}
              className="ScrollbarsCustom-Scroller Calendar-Scroller"
            />
          );
        },
      }}
    >
      <div
        onMouseDown={startScrollHandler}
        className={
          cursor == "pointer"
            ? styles.wrapperPointer
            : cursor == "grab"
            ? styles.wrapperGrab
            : styles.wrapper
        }
      >
        {children}
      </div>
    </Scrollbar>
  );
}
