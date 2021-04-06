import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import { useRouter } from "next/router";

import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function OptionWrapper({
  project,
  pencilIconRef,
  inputRef,
  trashIconRef,
  children,
}) {
  const router = useRouter();

  const { updateProject, projectByQueryId } = useContext(ProjectsContext);

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
        project._id == router.query.id ? styles.optionSelected : styles.option
      }
      onClick={handleProjectSelect}
    >
      {children}
    </div>
  );
}
