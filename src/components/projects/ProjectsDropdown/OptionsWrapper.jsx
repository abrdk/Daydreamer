import { nanoid } from "nanoid";
import { useContext, useState, useEffect } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import { When } from "react-if";
import Scrollbar from "react-scrollbars-custom";
import { useRouter } from "next/router";
import useMedia from "use-media";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import useEvent from "@react-hook/event";

const projectHeight = 50;

export default function OptionsWrapper({
  isDropdownOpened,
  setIsDropdownOpened,
  numberOfOptions,
  children,
}) {
  const isMobile = useMedia({ maxWidth: 576 });
  const [dropdownHeight, setDropdownHeight] = useState(0);
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
    if (isMobile) {
      if (numberOfOptions * projectHeight > window.innerHeight - 174) {
        return window.innerHeight - 174;
      }
      return numberOfOptions * projectHeight;
    }
    if (numberOfOptions * projectHeight > window.innerHeight - 131) {
      return window.innerHeight - 131;
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

  useEvent(window, "resize", () => {
    setDropdownHeight(getDropdownHeight());
  });

  useEffect(() => {
    setDropdownHeight(getDropdownHeight());
  }, [numberOfOptions]);

  return (
    <When condition={isDropdownOpened && isUserOwnsProject}>
      <div className={styles.wrap} onClick={closeDropdown}></div>
      <div className={styles.triangle}></div>
      <div className={styles.wrapOptions}>
        <Scrollbar noScrollX style={{ height: dropdownHeight }}>
          {children}
        </Scrollbar>
        <div className={styles.newProject} onClick={createNewProject}>
          + New Project
        </div>
      </div>
    </When>
  );
}
