import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import useEvent from "@react-hook/event";
import styles from "@/styles/calendar.module.scss";
import useMedia from "use-media";

export default function ScrollbarWeek({
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

  const startScrollHandler = (e) => {
    if (cursor == "pointer") {
      setInitialScrollLeft(e.clientX);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
      document.querySelector(".Calendar-Scroller").style.userSelect = "none";
    }
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const weeksInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    const initialMonth = date.getMonth();
    let numOfWeeks = 0;
    while (date.getMonth() == initialMonth) {
      if (date.getDay() == 0) {
        numOfWeeks += 1;
      }
      date.setDate(date.getDate() + 1);
    }
    return numOfWeeks;
  };

  const stopScrollHandler = (scrollValues) => {
    if (!isMouseDown) {
      const firstMonthWidth =
        weeksInMonth(
          calendarStartDate.getMonth(),
          calendarStartDate.getFullYear()
        ) * 120;
      const lastMonthWidth =
        weeksInMonth(
          calendarEndDate.getMonth(),
          calendarEndDate.getFullYear()
        ) * 120;
      if (scrollValues.scrollLeft < firstMonthWidth) {
        const widthOfMonths = [...Array(4).keys()].map(
          (i) =>
            weeksInMonth(
              calendarStartDate.getMonth() - i - 1,
              calendarStartDate.getFullYear()
            ) * 120
        );
        document.querySelector(".Calendar-Scroller").scrollBy(
          widthOfMonths.reduce((sum, width) => sum + width, 0),
          0
        );
        document.querySelector("#linesWrapper").style.paddingLeft =
          widthOfMonths.reduce((sum, width) => sum + width, 0) + "px";
        setCalendarStartDate(
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() - 4,
            1
          )
        );
      } else if (
        scrollValues.contentScrollWidth -
          scrollValues.clientWidth -
          scrollValues.scrollLeft <
        lastMonthWidth
      ) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear(),
            calendarEndDate.getMonth() + 4,
            daysInMonth(
              calendarEndDate.getFullYear(),
              calendarEndDate.getMonth() + 4
            ),
            23,
            59,
            59
          )
        );
      }
    }
  };

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

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  };

  useEffect(() => {
    const calculatedDefaultScrollLeft =
      window.innerWidth < 1200
        ? (getWeekNumber(new Date()) - 1) * 92
        : (getWeekNumber(new Date()) - 4) * 120;
    if (calculatedDefaultScrollLeft > 0) {
      document
        .querySelector(".Calendar-Scroller")
        .scrollBy(calculatedDefaultScrollLeft, 0);
    }
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  }, []);

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
