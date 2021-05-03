import Scrollbar from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import useEvent from "@react-hook/event";
import styles from "@/styles/calendar.module.scss";
import useMedia from "use-media";

export default function ScrollbarDay({
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  calendarStartDate,
  setCalendarStartDate,
  calendarEndDate,
  setCalendarEndDate,
  defaultScrollLeft,
  children,
}) {
  const isMobile = useMedia({ maxWidth: 576 });

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

  const stopScrollHandler = (scrollValues) => {
    if (!isMouseDown) {
      const firstMonthWidth =
        daysInMonth(
          calendarStartDate.getMonth(),
          calendarStartDate.getFullYear()
        ) * 55;
      const lastMonthWidth =
        daysInMonth(calendarEndDate.getMonth(), calendarEndDate.getFullYear()) *
        55;
      if (scrollValues.scrollLeft < firstMonthWidth) {
        const numOfDays = [...Array(3).keys()].map((i) =>
          daysInMonth(
            calendarStartDate.getMonth() - i - 1,
            calendarStartDate.getFullYear()
          )
        );

        document
          .querySelector(".Calendar-Scroller")
          .scrollBy(numOfDays.reduce((sum, num) => sum + num, 0) * 55, 0);
        setCalendarStartDate(
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() - 3,
            1
          )
        );
        document.querySelector("#linesWrapper").style.paddingLeft =
          numOfDays.reduce((sum, num) => sum + num, 0) * 55 + "px";
      } else if (
        scrollValues.contentScrollWidth -
          scrollValues.clientWidth -
          scrollValues.scrollLeft <
        lastMonthWidth
      ) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear(),
            calendarEndDate.getMonth() + 3,
            daysInMonth(
              calendarEndDate.getFullYear(),
              calendarEndDate.getMonth() + 3
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

  useEffect(() => {
    document.querySelector(".Calendar-Scroller").scrollBy(-1, 0);
    document.querySelector(".Calendar-Scroller").scrollBy(1, 0);
  }, []);

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      scrollLeft={defaultScrollLeft}
      noScrollY={true}
      style={{
        height: isMobile ? "calc(100vh - 83px)" : "calc(100vh - 89px)",
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
