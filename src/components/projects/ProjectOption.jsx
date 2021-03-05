import { useState, useContext, useEffect, useRef } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";
import { useRouter } from "next/router";

import { ProjectsContext } from "@/src/context/projects/ProjectsContext";
import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function Option({ project, projectIndex }) {
  const router = useRouter();
  const {
    projects,
    updateProject,
    deleteProject,
    projectByQueryId,
  } = useContext(ProjectsContext);
  const { deleteTasksByProject } = useContext(TasksContext);
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
      project._id != router.query.id
    ) {
      router.push(`/gantt/${project._id}`);
      updateProject({
        ...project,
        isCurrent: true,
      });
      updateProject({
        ...projectByQueryId,
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

  const updateHandler = (e) => {
    updateProject({ ...project, name: e.target.value });
  };

  const blurHandler = (e) => {
    setTimeout(() => setUpdatingState(false), 150);
    if (!e.target.value) {
      updateProject({
        ...project,
        name: `Project name #${projectIndex + 1}`,
      });
    }
  };

  const deleteHandler = () => {
    if (project._id == router.query.id) {
      if (projectIndex === projects.length - 1) {
        updateProject({
          ...projects[projectIndex - 1],
          isCurrent: true,
        });
        deleteProject(project._id);
        deleteTasksByProject(project._id);
        router.push(`/gantt/${projects[projectIndex - 1]._id}`);
      } else {
        updateProject({
          ...projects[projectIndex + 1],
          isCurrent: true,
        });
        deleteProject(project._id);
        deleteTasksByProject(project._id);
        router.push(`/gantt/${projects[projectIndex + 1]._id}`);
      }
    } else {
      deleteProject(project._id);
      deleteTasksByProject(project._id);
    }
  };

  const setTextWidth = () => {
    if (input.current && fakeText.current) {
      const textWidth = fakeText.current.offsetWidth;
      if (textWidth > 295) {
        input.current.style.width = "295px";
      } else {
        input.current.style.width = textWidth + "px";
      }
    }
    if (pencil.current && fakeText.current) {
      const textWidth = fakeText.current.offsetWidth + 14 + 10;
      if (textWidth > 320) {
        pencil.current.style.left = "320px";
      } else {
        pencil.current.style.left = textWidth + "px";
      }
    }
  };

  useEffect(() => {
    setTextWidth();
  }, [project, isUpdating]);

  useEffect(() => {
    if (isUpdating) {
      setTimeout(() => input.current.focus(), 100);
    }
  }, [isUpdating]);

  return (
    <div
      className={
        project._id == router.query.id ? styles.optionSelected : styles.option
      }
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
          <Truncate lines={1} width={300}>
            {project.name}
          </Truncate>
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
