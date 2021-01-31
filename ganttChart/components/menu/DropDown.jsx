import { useState, useContext, useEffect } from "react";

import { If, Then, Else, When } from "react-if";

import styles from "../../../styles/dropdown.module.css";

import { UsersContext } from "../../context/users/UsersContext";
import { ProjectsContext } from "../../context/projects/ProjectsContext";

export default function Menu({ isDropdownOpen, setDropdown }) {
  const { projects, updateProject, deleteProject } = useContext(
    ProjectsContext
  );

  const [selectedProject, setSelectedProject] = useState(
    projects.find((project) => project.isCurrent)
      ? projects.find((project) => project.isCurrent)
      : projects[0]
  );

  const getMinWidth = (id) => {
    const el = document.querySelector(id);
    if (el) {
      return Number(document.querySelector(id).offsetWidth) + 6 + "px";
    }
    return "0px";
  };

  useEffect(() => {
    projects.forEach((project, i) => {
      let input = document.querySelector(`#input-${i}`);
      if (input) {
        input.style.width = getMinWidth(`#fake${i}`);
      }
    });
  }, [projects, isDropdownOpen]);

  const options = projects.map((project, i) => (
    <div
      className={project.isCurrent ? styles.optionSelected : styles.option}
      onClick={(e) => {
        selectHandler(e, project, i);
      }}
      key={i}
    >
      <div className={styles.pencilWrapper}>
        <span className={styles.fakeText} id={`fake${i}`}>
          {project.name}
        </span>
        <input
          value={project.name}
          className={styles.input}
          id={`input-${i}`}
          onFocus={(e) => {
            e.target.blur();
          }}
        />
        <img
          src="/img/pencil.svg"
          alt=" "
          className={styles.pencil}
          // onClick={() => {
          //   console.log(getMinWidth(`#fake${i}`));
          // }}
        />
      </div>
      <When condition={projects.length > 1}>
        <img
          src="/img/trash.svg"
          alt=" "
          id={`trash${i}`}
          className={styles.icon}
          onClick={() => deleteHandler(project, i)}
        />
      </When>
    </div>
  ));

  const selectHandler = (e, project, i) => {
    if (e.target.id != `trash${i}` && !project.isCurrent) {
      updateProject({
        _id: project._id,
        name: project.name,
        isCurrent: true,
      });
      updateProject({
        _id: selectedProject._id,
        name: selectedProject.name,
        isCurrent: false,
      });
      setSelectedProject(project);
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

  return (
    <>
      <div
        className={isDropdownOpen ? styles.rootOpened : styles.root}
        onClick={() => setDropdown(!isDropdownOpen)}
      >
        <span>{selectedProject.name}</span>
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
          <div></div>
        </div>
      </When>
    </>
  );
}
