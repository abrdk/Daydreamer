import calendarStyles from "@/styles/calendar.module.scss";
import { When } from "react-if";
const dateFormat = require("dateformat");

export default function DateTooltip({
  isResizeLeft,
  isResizeRight,
  view,
  dateStart,
  dateEnd,
  taskWidth,
}) {
  return (
    <>
      <When condition={isResizeLeft && view != "Day"}>
        <div
          className={calendarStyles.tooltip}
          style={{
            left: -30,
          }}
        >
          {dateFormat(dateStart, "dd-mm-yyyy")}
          <div className={calendarStyles.triangle}></div>
        </div>
      </When>
      <When condition={isResizeRight && view != "Day"}>
        <div
          className={calendarStyles.tooltip}
          style={{
            left: taskWidth - 50,
          }}
        >
          {dateFormat(dateEnd, "dd-mm-yyyy")}
          <div className={calendarStyles.triangle}></div>
        </div>
      </When>
    </>
  );
}
