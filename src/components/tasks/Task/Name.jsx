import { useRef } from "react";
import { If, Then, Else } from "react-if";

import FakeText from "@/src/components/tasks/Task/Name/FakeText";
import Text from "@/src/components/tasks/Task/Name/Text";
import Input from "@/src/components/tasks/Task/Name/Input";

export default function Name({
  task,
  isUpdating,
  setUpdatingState,
  fakeTextRef,
  taskDepth,
}) {
  const input = useRef(null);

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
