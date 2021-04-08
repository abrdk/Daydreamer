import styles from "@/styles/tasks.module.scss";
import React, { useContext, memo } from "react";
import { When, If, Then, Else } from "react-if";

import ArrowDownSvg from "@/src/components/svg/ArrowDownSvg";
import ArrowRightSvg from "@/src/components/svg/ArrowRightSvg";

import { TasksContext } from "@/src/context/TasksContext";

const taskOffsetLeft = 14;

function InnerSubtasksArrow({
  taskId,
  hasSubtasks,
  arrow,
  taskDepth,
  updateIsOpened,
  isCurrentTaskOpened,
}) {
  const defaultLeft = isCurrentTaskOpened ? 2 : 7;

  const openSubtasks = (e) => {
    e.stopPropagation();
    updateIsOpened({ _id: taskId, isOpened: !isCurrentTaskOpened });
  };

  return (
    <When condition={hasSubtasks}>
      <If condition={isCurrentTaskOpened}>
        <Then>
          <div
            className={styles.arrowDown}
            ref={arrow}
            onClick={openSubtasks}
            style={{
              left: defaultLeft + taskDepth * taskOffsetLeft,
            }}
          >
            <ArrowDownSvg />
          </div>
        </Then>
        <Else>
          <div
            className={styles.arrowRight}
            ref={arrow}
            onClick={openSubtasks}
            style={{
              left: defaultLeft + taskDepth * taskOffsetLeft,
            }}
          >
            <ArrowRightSvg />
          </div>
        </Else>
      </If>
    </When>
  );
}

InnerSubtasksArrow = memo(
  InnerSubtasksArrow,
  (prevProps, nextProps) =>
    prevProps.hasSubtasks == nextProps.hasSubtasks &&
    prevProps.isCurrentTaskOpened == nextProps.isCurrentTaskOpened
);

export default function SubtasksArrow({
  taskId,
  hasSubtasks,
  arrow,
  taskDepth,
}) {
  const { updateIsOpened, isTaskOpened } = useContext(TasksContext);
  const isCurrentTaskOpened = isTaskOpened[taskId];
  return (
    <InnerSubtasksArrow
      {...{
        taskId,
        hasSubtasks,
        arrow,
        taskDepth,
        updateIsOpened,
        isCurrentTaskOpened,
      }}
    />
  );
}
