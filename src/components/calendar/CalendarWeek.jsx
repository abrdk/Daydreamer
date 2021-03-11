import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";
import useEvent from "@react-hook/event";
import { useEffect, useState, useMemo, useContext } from "react";

import LineTasks from "@/src/components/tasks/Line/LineTasks";

import { TasksContext } from "@/src//context/tasks/TasksContext";

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

export default function CalendarWeek({
  scrollAt,
  cursor,
  setCursor,
  isDraggable,
  setDraggable,
  setMenu,
  editedTask,
  setEditedTask,
  view,
}) {
  const { tasksByProjectId } = useContext(TasksContext);

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

  const today = new Date();

  const [calendarStartDate, setCalendarStartDate] = useState(
    new Date(today.getFullYear(), 0, 1)
  );
  const [calendarEndDate, setCalendarEndDate] = useState(
    new Date(
      today.getFullYear(),
      11,
      daysInMonth(today.getFullYear(), 11),
      23,
      59,
      59
    )
  );

  const [scrollLeft, setScrollLeft] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEvent(document, "mousedown", () => setIsMouseDown(true));
  useEvent(document, "mouseup", () => setIsMouseDown(false));

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  };

  useEffect(() => {
    const calculatedDefaultScrollLeft = (getWeekNumber(new Date()) - 4) * 120;
    if (calculatedDefaultScrollLeft > 0) {
      document
        .querySelector(".Calendar-Scroller")
        .scrollBy(calculatedDefaultScrollLeft, 0);
    }
  }, []);

  useEffect(() => {
    if (tasksByProjectId.length) {
      const startDates = tasksByProjectId.map((t) => {
        if (typeof t.dateStart == "string") {
          return new Date(t.dateStart);
        }
        return t.dateStart;
      });
      startDates.sort((t1, t2) => t1.getTime() - t2.getTime());
      const earliestDate = startDates[0];
      if (calendarStartDate.getTime() - earliestDate.getTime() > 0) {
        setCalendarStartDate(
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() -
              numOfMonths(earliestDate, calendarStartDate) +
              1,
            1
          )
        );
        const widthOfMonths = [
          ...Array(numOfMonths(earliestDate, calendarStartDate) - 1).keys(),
        ].map(
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
      }

      const endDates = tasksByProjectId.map((t) => {
        if (typeof t.dateEnd == "string") {
          return new Date(t.dateEnd);
        }
        return t.dateEnd;
      });
      endDates.sort((t1, t2) => t2.getTime() - t1.getTime());
      const latestDate = endDates[0];
      if (latestDate.getTime() - calendarEndDate.getTime() > 0) {
        setCalendarEndDate(
          new Date(
            calendarEndDate.getFullYear(),
            calendarEndDate.getMonth() +
              numOfMonths(calendarEndDate, latestDate) -
              1,
            daysInMonth(
              calendarEndDate.getFullYear(),
              calendarEndDate.getMonth() +
                numOfMonths(calendarEndDate, latestDate) -
                1
            ),
            23,
            59,
            59
          )
        );
      }
    }
  }, [tasksByProjectId]);

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

  const numOfDays = () => {
    return (
      Math.ceil((calendarEndDate - calendarStartDate) / (1000 * 60 * 60 * 24)) +
      1
    );
  };

  const isDayBetweenTwoDays = (day, weekStart, weekEnd) => {
    return (
      day.getTime() - weekStart.getTime() > 0 &&
      weekEnd.getTime() - day.getTime() > 0
    );
  };

  const weeksComponents = useMemo(
    () =>
      [...Array(numOfDays()).keys()]
        .map((day) => {
          let date = new Date();
          date.setFullYear(calendarStartDate.getFullYear());
          date.setMonth(calendarStartDate.getMonth());
          date.setDate(day + 1);
          let weekLater = new Date();
          weekLater.setFullYear(calendarStartDate.getFullYear());
          weekLater.setMonth(calendarStartDate.getMonth());
          weekLater.setDate(day + 7);
          weekLater.setHours(23);
          weekLater.setMinutes(59);
          weekLater.setSeconds(59);
          if (day == 0) {
            const dayOfWeek = (date.getDay() + 6) % 7;
            date.setDate(1 - dayOfWeek);
            weekLater.setDate(7 - dayOfWeek);
          }
          if (date.getDay() == 1) {
            return (
              <div key={`week-${day}`} style={{ position: "relative" }}>
                <div
                  className={
                    isDayBetweenTwoDays(today, date, weekLater)
                      ? styles.weekCurrent
                      : styles.week
                  }
                >
                  <div>{`${date.getDate()} - ${weekLater.getDate()}`}</div>
                </div>
                <When condition={isDayBetweenTwoDays(today, date, weekLater)}>
                  <div
                    className={styles.weekLine}
                    style={{
                      left:
                        (Math.ceil(
                          (today.getTime() - date.getTime()) /
                            1000 /
                            60 /
                            60 /
                            24
                        ) *
                          120) /
                        7,
                    }}
                  ></div>
                </When>
                <div className={styles.dashedContainerWeek}></div>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    [calendarStartDate, calendarEndDate]
  );

  const isWeekStartOfMonth = (weekStart) => {
    return (
      daysInMonth(weekStart.getMonth(), today.getFullYear()) -
        weekStart.getDate() <
        6 || weekStart.getDate() == 1
    );
  };

  const isWeekStartOfMonthArr = useMemo(
    () =>
      [...Array(numOfDays()).keys()]
        .map((day) => {
          let date = new Date();
          date.setFullYear(calendarStartDate.getFullYear());
          date.setMonth(calendarStartDate.getMonth());
          date.setDate(day + 1);
          if (day == 0) {
            const dayOfWeek = (date.getDay() + 6) % 7;
            date.setDate(1 - dayOfWeek);
          }
          if (date.getDay() == 1) {
            if (isWeekStartOfMonth(date)) {
              return true;
            }
            return false;
          }
        })
        .filter((bool) => typeof bool !== "undefined"),
    [calendarStartDate, calendarEndDate]
  );

  const weeksWithLabelsComponents = useMemo(
    () =>
      isWeekStartOfMonthArr
        .map((bool, i) => {
          if (bool) {
            let numOfWeeksInMonth = 1;
            isWeekStartOfMonthArr.slice(i + 1, i + 5).forEach((b) => {
              if (!b) {
                numOfWeeksInMonth += 1;
              }
            });

            const monthIndex = isWeekStartOfMonthArr
              .slice(0, i + 1)
              .reduce((sum, bool) => {
                if (bool) {
                  return sum + 1;
                }
                return sum;
              }, 0);
            return (
              <div key={`month-${i}`} className="month">
                <div className={styles.monthName}>
                  {
                    monthNames[
                      (calendarStartDate.getMonth() + monthIndex - 1) % 12
                    ]
                  }
                </div>
                <div className={styles.month}>
                  {weeksComponents.slice(i, i + numOfWeeksInMonth)}
                </div>
              </div>
            );
          }
        })
        .filter((component) => typeof component !== "undefined"),
    [calendarStartDate, calendarEndDate]
  );

  return (
    <Scrollbar
      onScrollStop={stopScrollHandler}
      scrollLeft={
        isDraggable ? scrollLeft - scrollAt + initialScrollLeft : undefined
      }
      noScrollY={true}
      style={{ height: "calc(100vh - 89px)", width: "100vw" }}
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
        {weeksWithLabelsComponents}
        <LineTasks
          setMenu={setMenu}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          view={view}
          calendarStartDate={
            new Date(
              calendarStartDate.getFullYear(),
              calendarStartDate.getMonth(),
              1 - ((calendarStartDate.getDay() + 6) % 7)
            )
          }
        />
      </div>
    </Scrollbar>
  );
}
