import { If, Then, Else } from "react-if";
import { useContext, useEffect } from "react";

import TaskFakeText from "@/src/components/tasks/Task/TaskName/TaskFakeText";
import TaskText from "@/src/components/tasks/Task/TaskName/TaskText";
import TaskInput from "@/src/components/tasks/Task/TaskName/TaskInput";

import { TasksContext } from "@/src/context/TasksContext";

export default function TaskName({
  task,
  isUpdating,
  setUpdatingState,
  fakeTextRef,
  taskDepth,
}) {
  const { whereEditNewTask } = useContext(TasksContext);

  useEffect(() => {
    if (task.name == "" && whereEditNewTask == "menu") {
      setUpdatingState(true);
    }
  }, [task.name]);

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
