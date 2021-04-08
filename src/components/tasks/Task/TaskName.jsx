import { If, Then, Else } from "react-if";
import React, { memo } from "react";

import TaskFakeText from "@/src/components/tasks/Task/TaskName/TaskFakeText";
import TaskText from "@/src/components/tasks/Task/TaskName/TaskText";
import TaskInput from "@/src/components/tasks/Task/TaskName/TaskInput";

function TaskName({
  task,
  isUpdating,
  setUpdatingState,
  fakeTextRef,
  taskDepth,
}) {
  return (
    <>
      <TaskFakeText task={task} fakeTextRef={fakeTextRef} />
      <If condition={isUpdating}>
        <Then>
          <TaskInput
            task={task}
            isUpdating={isUpdating}
            setUpdatingState={setUpdatingState}
            taskDepth={taskDepth}
            fakeTextRef={fakeTextRef}
          />
        </Then>
        <Else>
          <TaskText task={task} taskDepth={taskDepth} />
        </Else>
      </If>
    </>
  );
}

export default memo(
  TaskName,
  (prevProps, nextProps) =>
    prevProps.task.name == nextProps.task.name &&
    prevProps.isUpdating == nextProps.isUpdating
);
