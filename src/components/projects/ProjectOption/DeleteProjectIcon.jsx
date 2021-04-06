import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import { When } from "react-if";
import { useRouter } from "next/router";

import TrashSvg from "@/src/components/svg/TrashSvg";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import { TasksContext } from "@/src/context/TasksContext";

export default function DeleteProjectIcon({
  trashIconRef,
  project,
  projectIndex,
}) {
  const router = useRouter();
  const { projects, updateProject, deleteProject } = useContext(
    ProjectsContext
  );
  const { deleteTasksByProject } = useContext(TasksContext);

  const handleDeleteProject = (e) => {
    e.stopPropagation();

    let newCurrentProject;
    let newRoutePath;

    if (project._id == router.query.id) {
      if (projectIndex === projects.length - 1) {
        newCurrentProject = {
          ...projects[projectIndex - 1],
          isCurrent: true,
        };
        newRoutePath = `/gantt/${projects[projectIndex - 1]._id}`;
      } else {
        newCurrentProject = {
          ...projects[projectIndex + 1],
          isCurrent: true,
        };
        newRoutePath = `/gantt/${projects[projectIndex + 1]._id}`;
      }
    }

    if (newCurrentProject) {
      updateProject(newCurrentProject);
    }
    deleteProject(project._id);
    deleteTasksByProject(project._id);
    if (newRoutePath) {
      router.push(newRoutePath);
    }
  };

  return (
    <When condition={projects.length > 1}>
      <div className={styles.iconContainer} onClick={handleDeleteProject}>
        <div ref={trashIconRef} className={styles.trash}>
          <TrashSvg />
        </div>
      </div>
    </When>
  );
}
