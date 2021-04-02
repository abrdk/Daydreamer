import { nanoid } from "nanoid";
import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";
import Scrollbar from "react-scrollbars-custom";

import ProjectOption from "@/src/components/projects/ProjectOption";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function ProjectsDropdown({ isDropdownOpen, setDropdown }) {
  const userCtx = useContext(UsersContext);
  const { projects, createProject, projectByQueryId } = useContext(
    ProjectsContext
  );

  const projectsOptions = projects.map((project, i) => (
    <ProjectOption project={project} projectIndex={i} key={project._id} />
  ));

  const createHandler = () => {
    createProject({ _id: nanoid(), name: "", owner: userCtx._id });
  };

  const openDropdown = () => {
    if (projectByQueryId.owner == userCtx._id) {
      setDropdown(!isDropdownOpen);
    }
  };

  const getDropdownHeight = () => {
    if (projectsOptions.length > 10) {
      return 10 * 50;
    }
    return projectsOptions.length * 50;
  };

  return (
    <>
      <If condition={isDropdownOpen}>
        <Then>
          <div className={styles.rootOpened} onClick={openDropdown}>
            <Truncate lines={1} width={185}>
              {projectByQueryId.name}
            </Truncate>
            <img src="/img/arrowUp.svg" alt=" " />
          </div>
        </Then>
        <Else>
          <div className={styles.root} onClick={openDropdown}>
            <Truncate lines={1} width={185}>
              {projectByQueryId.name}
            </Truncate>
            <img src="/img/arrowDown.svg" alt=" " />
          </div>
        </Else>
      </If>

      <When condition={isDropdownOpen}>
        <div
          className={styles.wrap}
          onClick={() => setDropdown(!isDropdownOpen)}
        ></div>
        <div className={styles.triangle}></div>
        <div className={styles.wrapOptions}>
          <Scrollbar style={{ height: getDropdownHeight() }}>
            {projectsOptions}
          </Scrollbar>
          <div className={styles.newProject} onClick={createHandler}>
            + New Project
          </div>
        </div>
      </When>
    </>
  );
}
