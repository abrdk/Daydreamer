import { useState, useRef, memo, useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import { useRouter } from "next/router";

import DeleteProjectIcon from "@/src/components/projects/ProjectOption/DeleteProjectIcon";
import OptionName from "@/src/components/projects/ProjectOption/OptionName";
import OptionPencil from "@/src/components/projects/ProjectOption/OptionPencil";

import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerProjectOption({
  project,
  projectIndex,
  updateProject,
  projectByQueryId,
  isDropdownOpened,
}) {
  const router = useRouter();

  const [isNameUpdating, setIsNameUpdating] = useState(!project.name);
  const inputRef = useRef(null);
  const hiddenTextRef = useRef(null);
  const pencilIconRef = useRef(null);
  const trashIconRef = useRef(null);

  const handleProjectSelect = (e) => {
    if (
      ![trashIconRef.current, pencilIconRef.current, inputRef.current].includes(
        e.target
      ) &&
      project._id != router.query.id
    ) {
      const newCurrentProject = {
        ...project,
        isCurrent: true,
      };
      router.push(`/gantt/${project._id}`);
      updateProject(newCurrentProject);
      updateProject({
        ...projectByQueryId,
        isCurrent: false,
      });
    }
  };

  return (
    <div
      className={
        project._id == router.query.id
          ? styles.optionSelected + " projectOption"
          : styles.option + " projectOption"
      }
      onClick={handleProjectSelect}
    >
      <OptionName
        project={project}
        projectIndex={projectIndex}
        hiddenTextRef={hiddenTextRef}
        isNameUpdating={isNameUpdating}
        inputRef={inputRef}
        setIsNameUpdating={setIsNameUpdating}
        isDropdownOpened={isDropdownOpened}
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
    </div>
  );
}

InnerProjectOption = memo(InnerProjectOption, (prevProps, nextProps) => {
  for (let key in prevProps.project) {
    if (
      prevProps.project[key] != nextProps.project[key] ||
      prevProps.projectByQueryId[key] != nextProps.projectByQueryId[key]
    ) {
      return false;
    }
  }
  return prevProps.projectIndex == nextProps.projectIndex;
});

export default function ProjectOption(props) {
  const { updateProject, projectByQueryId } = useContext(ProjectsContext);

  return (
    <InnerProjectOption {...{ ...props, updateProject, projectByQueryId }} />
  );
}
