import React from "react";
import {
  progressWithByParams,
  getProgressPoint,
} from "../../helpers/bar-helper";
import styles from "./bar.module.css";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";


export const Bar = ({
  task,
  arrowIndent,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isDelete,
  isSelected,
}) => {
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(
    progressWidth + task.x1,
    task.y,
    task.height
  );

  return (
    <g
      className={styles.barWrapper}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Delete') {
          if (isDelete) onEventStart("delete", task, e);
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressWidth={progressWidth}
        barCornerRadius={task.barCornerRadius}
        text={task.name}
        hasChild={task.barChildren.length > 0}
        arrowIndent={arrowIndent}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={task.height - 2}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={task.height - 2}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
