import { useState, useContext, useEffect, memo } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else } from "react-if";

import { ProjectsContext } from "@/src/context/ProjectsContext";

const maxInputWidth = 295;

function InnerOptionName({
  project,
  projectIndex,
  hiddenTextRef,
  isNameUpdating,
  setIsNameUpdating,
  inputRef,
  updateProject,
}) {
  const [inputWidth, setInputWidth] = useState(maxInputWidth);
  const [projectName, setProjectName] = useState(project.name);

  const handleNameUpdate = (e) => {
    setProjectName(e.target.value);
    updateProject({ ...project, name: e.target.value });
  };

  const handleBlur = (e) => {
    setIsNameUpdating(false);
    if (!e.target.value) {
      setProjectName(`Project name #${projectIndex + 1}`);
      updateProject({
        ...project,
        name: `Project name #${projectIndex + 1}`,
      });
    }
  };

  const getInputWidth = () => {
    if (hiddenTextRef.current) {
      const textWidth = hiddenTextRef.current.offsetWidth;
      if (textWidth + 5 > maxInputWidth) {
        return maxInputWidth;
      }
      return textWidth + 5;
    }
  };

  useEffect(() => {
    setInputWidth(getInputWidth());
  }, [projectName, isNameUpdating]);

  useEffect(() => {
    if (isNameUpdating) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isNameUpdating]);

  return (
    <>
      <If condition={isNameUpdating}>
        <Then>
          <input
            ref={inputRef}
            value={projectName}
            className={styles.input}
            onChange={handleNameUpdate}
            onBlur={handleBlur}
            style={{ width: inputWidth }}
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
          ref={hiddenTextRef}
        >
          {project.name ? project.name : `Project name #${projectIndex + 1}`}
        </span>
      </div>
    </>
  );
}

InnerOptionName = memo(
  InnerOptionName,
  (prevProps, nextProps) =>
    prevProps.projectIndex == nextProps.projectIndex &&
    prevProps.project.name == nextProps.project.name &&
    prevProps.project.isCurrent == nextProps.project.isCurrent &&
    prevProps.isNameUpdating == nextProps.isNameUpdating
);

export default function OptionName(props) {
  const { updateProject } = useContext(ProjectsContext);

  return (
    <InnerOptionName
      {...{
        ...props,
        updateProject,
      }}
    />
  );
}
