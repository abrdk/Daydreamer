import { useRef } from "react";
import { If, Then, Else } from "react-if";
import { useContext, useEffect, useState } from "react";

import FakeText from "@/src/components/tasks/Task/Name/FakeText";
import Text from "@/src/components/tasks/Task/Name/Text";
import Input from "@/src/components/tasks/Task/Name/Input";

import { TasksContext } from "@/src/context/TasksContext";

export default function Name({
  task,
  isUpdating,
  setUpdatingState,
  fakeTextRef,
  taskDepth,
}) {
  const { whereEditNewTask } = useContext(TasksContext);

  const input = useRef(null);

  useEffect(() => {
    if (task.name == "" && whereEditNewTask == "menu") {
      setUpdatingState(true);
    }
  }, [task.name]);

  return (
    <>
      <FakeText task={task} fakeTextRef={fakeTextRef} />
      <If condition={isUpdating}>
        <Then>
          <Input
            task={task}
            inputRef={input}
            isUpdating={isUpdating}
            setUpdatingState={setUpdatingState}
            taskDepth={taskDepth}
          />
        </Then>
        <Else>
          <Text task={task} taskDepth={taskDepth} />
        </Else>
      </If>
    </>
  );
}
