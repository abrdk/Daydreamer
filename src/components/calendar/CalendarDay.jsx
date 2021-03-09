import styles from "@/styles/calendar.module.scss";
import Scrollbar from "react-scrollbars-custom";
import { When } from "react-if";
import { useEffect, useState, useMemo, useContext } from "react";
import useEvent from "@react-hook/event";

import LineTasks from "@/src/components/tasks/Line/LineTasks";

import { TasksContext } from "@/src//context/tasks/TasksContext";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

export default function CalendarDay({
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
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
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
  const { tasksByProjectId } = useContext(TasksContext);
  const [defaultScrollLeft, setDefaultScrollLeft] = useState(undefined);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEvent(document, "mousedown", () => setIsMouseDown(true));
  useEvent(document, "mouseup", () => setIsMouseDown(false));

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
        daysInMonth(
          calendarStartDate.getMonth(),
          calendarStartDate.getFullYear()
        ) * 55;
      const lastMonthWidth =
        daysInMonth(
          calendarStartDate.getMonth(),
          calendarStartDate.getFullYear()
        ) * 55;
      if (scrollValues.scrollLeft < firstMonthWidth) {
        const numOfDays = [...Array(3).keys()].map((i) =>
          daysInMonth(
            calendarStartDate.getMonth() - i - 1,
            calendarStartDate.getFullYear()
          )
        );
        setDefaultScrollLeft(
          scrollValues.scrollLeft +
            numOfDays.reduce((sum, num) => sum + num, 0) * 55
        );
        setCalendarStartDate(
          new Date(
            calendarStartDate.getFullYear(),
            calendarStartDate.getMonth() - 3,
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

  const numOfMonths = (startDate, endDate) => {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth() + 1;
    return months <= 0 ? 0 : months;
  };

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
        const numOfDays = [
          ...Array(numOfMonths(earliestDate, calendarStartDate) - 1).keys(),
        ].map((i) =>
          daysInMonth(
            calendarStartDate.getMonth() - i - 1,
            calendarStartDate.getFullYear()
          )
        );
        document
          .querySelector(".Calendar-Scroller")
          .scrollBy(numOfDays.reduce((sum, num) => sum + num, 0) * 55, 0);
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

  useEffect(() => {
    if (typeof defaultScrollLeft != "undefined") {
      setDefaultScrollLeft(undefined);
    }
  }, [defaultScrollLeft]);

  const numOfDays = () => {
    return (
      Math.ceil((calendarEndDate - calendarStartDate) / (1000 * 60 * 60 * 24)) +
      1
    );
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  };

  const isCalendarWidthNotChanged = () =>
    calendarStartDate.getFullYear() == today.getFullYear() &&
    calendarStartDate.getMonth() == 0 &&
    calendarEndDate.getFullYear() == today.getFullYear();

  const daysComponents = useMemo(
    () =>
      [...Array(numOfDays()).keys()].map((day) => {
        let date = new Date();
        date.setFullYear(calendarStartDate.getFullYear());
        date.setMonth(calendarStartDate.getMonth());
        date.setDate(day + 1);
        if (isSameDate(today, date) && isCalendarWidthNotChanged()) {
          const calculatedDefaultScrollLeft = (day - 9) * 55;
          if (calculatedDefaultScrollLeft > 0) {
            setDefaultScrollLeft(calculatedDefaultScrollLeft);
          } else {
            setDefaultScrollLeft(0);
          }
        }
        return (
          <div key={`day-${day}`} style={{ position: "relative" }}>
            <div
              className={
                isSameDate(today, date)
                  ? styles.today
                  : date.getDay() == 0 || date.getDay() == 6
                  ? styles.weekend
                  : styles.day
              }
            >
              <div>{date.getDate()}</div>
              <div>{daysOfWeek[date.getDay()]}</div>
            </div>
            <div
              className={
                date.getDay() == 0 || date.getDay() == 6
                  ? styles.dashedContainerWeekend
                  : styles.dashedContainer
              }
            ></div>
            <When condition={isSameDate(today, date)}>
              <div className={styles.line}></div>
            </When>
          </div>
        );
      }),
    [calendarStartDate, calendarEndDate]
  );

  const numOfDaysInMonths = useMemo(
    () =>
      [...Array(numOfMonths(calendarStartDate, calendarEndDate)).keys()].map(
        (m) => {
          return daysInMonth(
            calendarStartDate.getMonth() + m,
            calendarStartDate.getFullYear()
          );
        }
      ),
    [calendarStartDate, calendarEndDate]
  );
  const daysWithLabelsComponents = useMemo(
    () =>
      numOfDaysInMonths.map((numOfDaysInMonth, i) => {
        return (
          <div className="month" key={`month-${i}`}>
            <div className={styles.monthName}>
              {monthNames[(calendarStartDate.getMonth() + i) % 12]}
            </div>
            <div className={styles.month}>
              {daysComponents.slice(
                numOfDaysInMonths.slice(0, i).reduce((a, sum) => a + sum, 0),
                numOfDaysInMonths.slice(0, i + 1).reduce((a, sum) => a + sum, 0)
              )}
            </div>
          </div>
        );
      }),
    [calendarStartDate, calendarEndDate]
  );

  return (
    <>
      <Scrollbar
        onScrollStop={stopScrollHandler}
        scrollLeft={
          isDraggable
            ? scrollLeft - scrollAt + initialScrollLeft
            : defaultScrollLeft
        }
        noScrollY={true}
        style={{ height: "calc(100vh - 89px - 0px)", width: "100vw" }}
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
          {daysWithLabelsComponents}
          <LineTasks
            calendarStartDate={calendarStartDate}
            setMenu={setMenu}
            editedTask={editedTask}
            setEditedTask={setEditedTask}
            view={view}
          />
        </div>
      </Scrollbar>
    </>
  );
}
