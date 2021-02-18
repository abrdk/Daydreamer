import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";
import { useEffect, useState, useMemo } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarMonth({
  scrollAt,
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
}) {
  const [defaultScrollLeft, setDefaultScrollLeft] = useState(undefined);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const startScrollHandler = () => {
    if (cursor == "pointer") {
      setInitialScrollLeft(scrollAt);
      setDraggable(true);
      document.body.style.cursor = "grab";
      setCursor("grab");
    }
  };
  const stopScrollHandler = (scrollValues) => {
    if (cursor != "grab") {
      setScrollLeft(scrollValues.scrollLeft);
    }
  };
  useEffect(() => {
    const today = new Date();
    const calculatedDefaultScrollLeft = (today.getMonth() - 2) * 160;
    if (calculatedDefaultScrollLeft > 0) {
      setDefaultScrollLeft(calculatedDefaultScrollLeft);
    } else {
      setDefaultScrollLeft(0);
    }
  }, []);

  useEffect(() => {
    if (typeof defaultScrollLeft != "undefined") {
      setDefaultScrollLeft(undefined);
    }
  }, [defaultScrollLeft]);

  const isSameMonth = (date1, date2) => {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth()
    );
  };
  const monthsComponents = useMemo(
    () =>
      [...Array(24).keys()].map((month) => {
        let date = new Date();
        date.setMonth(0);
        date.setDate(1);
        date.setMonth(month);
        return (
          <div key={`month-${month}`}>
            <div
              className={
                isSameMonth(new Date(), date)
                  ? styles.monthCurrent
                  : styles.monthWrapper
              }
            >
              <div>{monthNames[month % 12]}</div>
            </div>
            <When condition={isSameMonth(new Date(), date)}>
              <div className={styles.monthLine}></div>
            </When>
          </div>
        );
      }),
    []
  );

  const monthsWithLabelsComponents = useMemo(
    () =>
      [...Array(2).keys()].map((year) => {
        let date = new Date();
        date.setFullYear(date.getFullYear() + year);
        return (
          <div key={`year-${year}`}>
            <div className={styles.monthName}>{date.getFullYear()}</div>
            <div className={styles.month}>
              {monthsComponents.slice(12 * year, 12 + 12 * year)}
            </div>
          </div>
        );
      }),
    []
  );
  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      scrollLeft={
        isDraggable
          ? scrollLeft - scrollAt + initialScrollLeft
          : defaultScrollLeft
      }
      style={{ height: "calc(100vh - 89px - 10px)", width: "100vw" }}
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
        {monthsWithLabelsComponents}
      </div>
    </Scrollbar>
  );
}
