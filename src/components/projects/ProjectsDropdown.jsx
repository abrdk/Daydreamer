import { nanoid } from "nanoid";
import { useContext, useState, useEffect } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";
import Scrollbar from "react-scrollbars-custom";
import { useRouter } from "next/router";
import useEvent from "@react-hook/event";

import ProjectOption from "@/src/components/projects/ProjectOption";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function ProjectsDropdown({ isDropdownOpen, setDropdown }) {
  const router = useRouter();
  const userCtx = useContext(UsersContext);
  const { projects, createProject, projectByQueryId } = useContext(
    ProjectsContext
  );
  const [projectIndex, setProjectIndex] = useState(0);

  const projectsOptions = projects.map((project, i) => (
    <ProjectOption project={project} projectIndex={i} key={project._id} />
  ));

  const createHandler = () => {
    const newProjectId = nanoid();
    const newProject = {
      _id: newProjectId,
      name: "",
      owner: userCtx._id,
      isCurrent: true,
    };
    createProject(newProject);

    router.push(`/gantt/${newProjectId}`);
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

  useEffect(() => {
    setProjectIndex(projects.findIndex((p) => p._id == projectByQueryId._id));
  }, [projectByQueryId._id]);

  useEvent(document, "keydown", (e) => {
    if (e.code == "Enter") {
      setDropdown(false);
    }
  });

  return (
    <>
      <If condition={isDropdownOpen}>
        <Then>
          <div className={styles.rootOpened} onClick={openDropdown}>
            <Truncate lines={1} width={185}>
              {projectByQueryId.name}
            </Truncate>
            <img src="/img/arrowUp.svg" alt=" " />
            <When condition={projectByQueryId.name == ""}>
              <div className={styles.hiddenName}>{`Project name #${
                projectIndex + 1
              }`}</div>
            </When>
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
