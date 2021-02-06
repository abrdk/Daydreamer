import { nanoid } from "nanoid";
import { useState, useContext, useEffect } from "react";

import { If, Then, Else, When } from "react-if";

import styles from "../../../styles/dropdown.module.css";

import { ProjectsContext } from "../../context/projects/ProjectsContext";

export default function Menu({ isDropdownOpen, setDropdown }) {
  const { projects, createProject, updateProject, deleteProject } = useContext(
    ProjectsContext
  );

  const [isNameUpdating, setNameUpdating] = useState(projects.map(() => false));

  const [selectedProject, setSelectedProject] = useState(
    projects.find((project) => project.isCurrent)
      ? projects.find((project) => project.isCurrent)
      : projects[0]
  );

  const getMinWidth = (id) => {
    const el = document.querySelector(id);
    if (el) {
      const width = Number(document.querySelector(id).offsetWidth);
      if (width > 300) {
        return "300px";
      }
      return width + 6 + "px";
    }
    return "0px";
  };

  const startUpdateHandler = (i) => {
    if (!isNameUpdating[i]) {
      setNameUpdating(
        isNameUpdating.map((bool, index) => {
          if (index == i) {
            return true;
          }
          return false;
        })
      );
      setTimeout(() => document.querySelector(`#input-${i}`).focus(), 100);
    } else {
      setNameUpdating(
        isNameUpdating.map((bool, index) => {
          if (index == i) {
            return false;
          }
          return bool;
        })
      );
    }
  };

  const selectHandler = (e, project, i) => {
    if (
      e.target.id != `trash${i}` &&
      e.target.id != `pencil-${i}` &&
      !project.isCurrent
    ) {
      const newProject = {
        _id: project._id,
        name: project.name,
        isCurrent: true,
      };
      updateProject(newProject);
      updateProject({
        _id: selectedProject._id,
        name: selectedProject.name,
        isCurrent: false,
      });
      setSelectedProject(newProject);
    }
  };

  const deleteHandler = (project, i) => {
    if (project.isCurrent) {
      if (i === projects.length - 1) {
        updateProject({
          _id: projects[i - 1]._id,
          name: projects[i - 1].name,
          isCurrent: true,
        });
        setSelectedProject(projects[i - 1]);
      } else {
        updateProject({
          _id: projects[i + 1]._id,
          name: projects[i + 1].name,
          isCurrent: true,
        });
        setSelectedProject(projects[i + 1]);
      }
    }
    deleteProject(project._id);
  };

  const focusHandler = (e, i) => {
    if (!isNameUpdating[i]) {
      e.target.blur();
    }
  };

  const blurHandler = (e, i, project) => {
    if (e.target.value === "") {
      const newProject = {
        _id: project._id,
        name: `Project name #${i + 1}`,
        isCurrent: project.isCurrent,
      };
      updateProject(newProject);
      if (project.isCurrent) {
        setSelectedProject(newProject);
      }
    }
  };

  const updateHandler = (e, project) => {
    const newProject = {
      _id: project._id,
      name: e.target.value,
      isCurrent: project.isCurrent,
    };
    updateProject(newProject);
    if (project.isCurrent) {
      setSelectedProject(newProject);
    }
  };

  const createHandler = () => {
    createProject({ _id: nanoid(), name: "" });
    startUpdateHandler(projects.length);
  };

  useEffect(() => {
    projects.forEach((project, i) => {
      let input = document.querySelector(`#input-${i}`);
      if (input) {
        input.style.width = getMinWidth(`#fake${i}`);
      }
    });
    if (projects.length > isNameUpdating.length) {
      setNameUpdating([...isNameUpdating, true]);
    } else if (projects.length < isNameUpdating.length) {
      setNameUpdating(isNameUpdating.slice(0, projects.length));
    }
  }, [projects, isDropdownOpen]);

  const options = projects.map((project, i) => (
    <div
      className={project.isCurrent ? styles.optionSelected : styles.option}
      onClick={(e) => selectHandler(e, project, i)}
      key={i}
    >
      <div className={styles.pencilWrapper}>
        <div className={styles.fakeTextWrapper}>
          <span
            className={project.name ? styles.fakeText : styles.fakeTextVisible}
            id={`fake${i}`}
          >
            {project.name ? project.name : `Project name #${i + 1}`}
          </span>
        </div>
        <input
          value={project.name}
          className={styles.input}
          id={`input-${i}`}
          onFocus={(e) => focusHandler(e, i)}
          onChange={(e) => updateHandler(e, project)}
          onBlur={(e) => blurHandler(e, i, project)}
        />
        <div
          className={styles.iconContainer}
          onClick={(e) => {
            startUpdateHandler(i);
          }}
        >
          <img
            src="/img/pencil.svg"
            alt=" "
            id={`pencil-${i}`}
            className={styles.pencil}
          />
        </div>
      </div>
      <When condition={projects.length > 1}>
        <div
          className={styles.iconContainer}
          onClick={() => deleteHandler(project, i)}
        >
          <img
            src="/img/trash.svg"
            alt=" "
            id={`trash${i}`}
            className={styles.icon}
          />
        </div>
      </When>
    </div>
  ));

  return (
    <>
      <div
        className={isDropdownOpen ? styles.rootOpened : styles.root}
        onClick={() => setDropdown(!isDropdownOpen)}
      >
        <span id="selectedProjectName">
          {selectedProject.name.length > 18
            ? selectedProject.name.slice(0, 18) + "..."
            : selectedProject.name}
        </span>
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
          {options}
          <div className={styles.newProject} onClick={createHandler}>
            + New Project
          </div>
        </div>
      </When>
    </>
  );
}
