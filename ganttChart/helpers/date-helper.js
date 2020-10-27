import { ViewMode } from "../types/public-types";

export const month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

export const addToDate = (
  date,
  quantity,
  scale
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date, scale) => {
  if(typeof date === 'string') date = new Date(date);
  const scores = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const shouldReset = (_scale) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const ganttDateRange = (tasks, viewMode) => {
  let newStartDate = tasks[0].start;
  let newEndDate = tasks[0].end;
  for (const task of tasks) {
    if (task.start < newStartDate) {
      newStartDate = task.start;
    }
    if (task.end > newEndDate) {
      newEndDate = task.end;
    }
  }
  switch (viewMode) {
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(getMonday(newStartDate), -7, "day");
      newEndDate = addToDate(newEndDate, 1.5, "month");
      break;
    default:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(newStartDate, -1, "day");
      newEndDate = addToDate(newEndDate, 19, "day");
      break;
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate,
  endDate,
  viewMode
) => {
  let currentDate = new Date(startDate);
  const dates = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date, locale) => {
  let bottomValue = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

export const getLocaleWeekDay = (date, locale) => {
  let bottomValue = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(date);
  return bottomValue;
};

export const dateString = (d) => {
  let date = new Date(d);
  let day = date.getDate().toString();
  day = day.length === 1 ? 0+day : day
  return day + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();
}

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};
