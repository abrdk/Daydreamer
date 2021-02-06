import { useState, useContext, useEffect, useRef } from "react";
import styles from "../../../styles/projectsDropdown.module.scss";
import TextTruncate from "react-text-truncate";

import { If, Then, Else, When } from "react-if";

import { ProjectsContext } from "../../context/projects/ProjectsContext";

export default function Option({ project, projectIndex }) {
  const { projects, createProject, updateProject, deleteProject } = useContext(
    ProjectsContext
  );
  let selectedProject = projects.find((project) => project.isCurrent);
  if (!selectedProject) {
    selectedProject = projects[0];
  }
  const [isUpdating, setUpdatingState] = useState(!project.name);
  const input = useRef(null);
  const fakeText = useRef(null);
  const pencil = useRef(null);
  const trash = useRef(null);

  const selectHandler = (e) => {
    if (
      e.target != trash.current &&
      e.target != pencil.current &&
      e.target != input.current &&
      !project.isCurrent
    ) {
      updateProject({
        ...project,
        isCurrent: true,
      });
      updateProject({
        ...selectedProject,
        isCurrent: false,
      });
    }
  };

  const startUpdateHandler = (e) => {
    if (!isUpdating) {
      setUpdatingState(true);
    } else if (e.target != input.current) {
      setUpdatingState(false);
    }
  };

  const updateHandler = async (e) => {
    await updateProject({ ...project, name: e.target.value });
  };

  const blurHandler = async (e) => {
    setTimeout(() => setUpdatingState(false), 150);
    if (!e.target.value) {
      await updateProject({
        ...project,
        name: `Project name #${projectIndex + 1}`,
      });
    }
  };

  const deleteHandler = async () => {
    if (project.isCurrent) {
      if (projectIndex === projects.length - 1) {
        await Promise.all([
          updateProject({
            ...projects[projectIndex - 1],
            isCurrent: true,
          }),
          deleteProject(project._id),
        ]);
      } else {
        await Promise.all([
          updateProject({
            ...projects[projectIndex + 1],
            isCurrent: true,
          }),
          deleteProject(project._id),
        ]);
      }
    } else {
      await deleteProject(project._id);
    }
  };

  useEffect(() => {
    if (input.current && fakeText.current) {
      input.current.style.width = fakeText.current.offsetWidth + "px";
    }
    if (pencil.current && fakeText.current) {
      const textWidth = fakeText.current.offsetWidth + 14 + 10;
      if (textWidth > 320) {
        pencil.current.style.left = "320px";
      } else {
        pencil.current.style.left = textWidth + "px";
      }
    }
  }, [project, isUpdating]);

  useEffect(() => {
    if (isUpdating) {
      setTimeout(() => input.current.focus(), 100);
    }
  }, [isUpdating]);

  return (
    <div
      className={project.isCurrent ? styles.optionSelected : styles.option}
      onClick={selectHandler}
    >
      <If condition={isUpdating}>
        <Then>
          <input
            ref={input}
            value={project.name}
            className={styles.input}
            onChange={updateHandler}
            onBlur={blurHandler}
          />
        </Then>
        <Else>
          <TextTruncate
            line={1}
            truncateText="…"
            element="span"
            text={project.name}
            containerClassName={styles.textOptionWrapper}
          />
        </Else>
      </If>
      <div className={styles.fakeTextWrapper}>
        <span
          className={project.name ? styles.fakeText : styles.fakeTextVisible}
          ref={fakeText}
        >
          {project.name ? project.name : `Project name #${projectIndex + 1}`}
        </span>
      </div>
      <div className={styles.iconContainer} onClick={startUpdateHandler}>
        <img
          src="/img/pencil.svg"
          alt=" "
          className={styles.pencil}
          ref={pencil}
        />
      </div>
      <When condition={projects.length > 1}>
        <div className={styles.iconContainer} onClick={deleteHandler}>
          <img
            src="/img/trash.svg"
            alt=" "
            ref={trash}
            className={styles.trash}
          />
        </div>
      </When>
    </div>
  );
}
