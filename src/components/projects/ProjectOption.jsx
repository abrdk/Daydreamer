import { useState, useRef } from "react";

import DeleteProjectIcon from "@/src/components/projects/ProjectOption/DeleteProjectIcon";
import OptionWrapper from "@/src/components/projects/ProjectOption/OptionWrapper";
import OptionName from "@/src/components/projects/ProjectOption/OptionName";
import OptionPencil from "@/src/components/projects/ProjectOption/OptionPencil";

export default function ProjectOption({ project, projectIndex }) {
  const [isNameUpdating, setIsNameUpdating] = useState(!project.name);

  const inputRef = useRef(null);
  const hiddenTextRef = useRef(null);
  const pencilIconRef = useRef(null);
  const trashIconRef = useRef(null);

  return (
    <OptionWrapper
      project={project}
      pencilIconRef={pencilIconRef}
      inputRef={inputRef}
      trashIconRef={trashIconRef}
    >
      <OptionName
        project={project}
        projectIndex={projectIndex}
        hiddenTextRef={hiddenTextRef}
        isNameUpdating={isNameUpdating}
        inputRef={inputRef}
        setIsNameUpdating={setIsNameUpdating}
      />

      <OptionPencil
        projectName={project.name}
        isNameUpdating={isNameUpdating}
        setIsNameUpdating={setIsNameUpdating}
        inputRef={inputRef}
        pencilIconRef={pencilIconRef}
        hiddenTextRef={hiddenTextRef}
      />

      <DeleteProjectIcon
        trashIconRef={trashIconRef}
        project={project}
        projectIndex={projectIndex}
      />
    </OptionWrapper>
  );
}
