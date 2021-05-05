import { nanoid } from "nanoid";
import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import { When } from "react-if";
import Scrollbar from "react-scrollbars-custom";
import { useRouter } from "next/router";
import useMedia from "use-media";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

const projectHeight = 50;

export default function OptionsWrapper({
  isDropdownOpened,
  setIsDropdownOpened,
  numberOfOptions,
  children,
}) {
  const isMobile = useMedia({ maxWidth: 576 });

  const router = useRouter();
  const { user } = useContext(UsersContext);
  const {
    createProject,
    updateProject,
    isUserOwnsProject,
    projects,
  } = useContext(ProjectsContext);

  const createNewProject = () => {
    const newProjectId = nanoid();
    const newProject = {
      _id: newProjectId,
      name: "",
      owner: user._id,
      isCurrent: true,
    };
    createProject(newProject);
    router.push(`/gantt/${newProjectId}`);
  };

  const getDropdownHeight = () => {
    if (numberOfOptions > 10) {
      return 10 * projectHeight;
    }
    return numberOfOptions * projectHeight;
  };

  const closeDropdown = () => {
    projects.forEach(
      (p, index) =>
        !p.name && updateProject({ ...p, name: `Project name ${index + 1}` })
    );
    setIsDropdownOpened(false);
  };

  return (
    <When condition={isDropdownOpened && isUserOwnsProject}>
      <div className={styles.wrap} onClick={closeDropdown}></div>
      <div className={styles.triangle}></div>
      <div className={styles.wrapOptions}>
        <Scrollbar noScrollX style={{ height: getDropdownHeight() }}>
          {children}
        </Scrollbar>
        <div className={styles.newProject} onClick={createNewProject}>
          + New Project
        </div>
      </div>
    </When>
  );
}
