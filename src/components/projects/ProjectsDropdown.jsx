import { nanoid } from "nanoid";
import { useContext } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";

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

  return (
    <>
      <div
        className={isDropdownOpen ? styles.rootOpened : styles.root}
        onClick={
          projectByQueryId.owner == userCtx._id
            ? () => setDropdown(!isDropdownOpen)
            : () => {}
        }
      >
        <Truncate lines={1} width={185}>
          {projectByQueryId.name}
        </Truncate>
        <If condition={isDropdownOpen}>
          <Then>
            <img src="/img/arrowUp.svg" alt=" " />
          </Then>
          <Else>
            <img src="/img/arrowDown.svg" alt=" " />
          </Else>
        </If>
      </div>
      <When condition={isDropdownOpen}>
        <div
          className={styles.wrap}
          onClick={() => setDropdown(!isDropdownOpen)}
        ></div>
        <div className={styles.triangle}></div>
        <div className={styles.wrapOptions}>
          {projectsOptions}
          <div className={styles.newProject} onClick={createHandler}>
            + New Project
          </div>
        </div>
      </When>
    </>
  );
}
