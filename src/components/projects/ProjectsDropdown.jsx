import { useContext, useState, memo } from "react";
import useEvent from "@react-hook/event";

import ProjectOption from "@/src/components/projects/ProjectOption";
import OptionsWrapper from "@/src/components/projects/ProjectsDropdown/OptionsWrapper";
import CurrentOption from "@/src/components/projects/ProjectsDropdown/CurrentOption";

import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerProjectsDropdown({ projects, isUserOwnsProject }) {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  let projectsOptions = [];
  if (isUserOwnsProject) {
    projectsOptions = projects.map((project, i) => (
      <ProjectOption project={project} projectIndex={i} key={project._id} />
    ));
  }

  useEvent(document, "keydown", (e) => {
    if (e.code == "Enter") {
      setIsDropdownOpened(false);
    }
  });

  return (
    <>
      <CurrentOption
        isDropdownOpened={isDropdownOpened}
        setIsDropdownOpened={setIsDropdownOpened}
      />

      <OptionsWrapper
        isDropdownOpened={isDropdownOpened}
        setIsDropdownOpened={setIsDropdownOpened}
        numberOfOptions={projectsOptions.length}
      >
        {projectsOptions}
      </OptionsWrapper>
    </>
  );
}

InnerProjectsDropdown = memo(InnerProjectsDropdown);

export default function ProjectsDropdown() {
  const { projects, isUserOwnsProject } = useContext(ProjectsContext);

  return <InnerProjectsDropdown {...{ projects, isUserOwnsProject }} />;
}
