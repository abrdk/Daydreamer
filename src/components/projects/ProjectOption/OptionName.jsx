import { useState, useContext, useEffect, memo } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else } from "react-if";
import useMedia from "use-media";

import { ProjectsContext } from "@/src/context/ProjectsContext";
import useEvent from "@react-hook/event";

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
  const isMobile = useMedia({ maxWidth: 768 });
  const [inputWidth, setInputWidth] = useState(maxInputWidth);
  const [textWidth, setTextWidth] = useState(300);
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
      if (isMobile) {
        if (
          textWidth + 5 >
          document.querySelector(".projectOption").clientWidth - 60
        ) {
          return document.querySelector(".projectOption").clientWidth - 60;
        }
        return textWidth + 5;
      }

      if (textWidth + 5 > maxInputWidth) {
        return maxInputWidth;
      }
      return textWidth + 5;
    }
  };

  const getTextWidth = () =>
    document.querySelector(".projectOption").clientWidth - 60;

  useEffect(() => {
    setInputWidth(getInputWidth());
  }, [projectName, isNameUpdating]);

  useEvent(window, "resize", () => {
    if (isMobile) {
      setTextWidth(getTextWidth());
    } else {
      setTextWidth(300);
    }
  });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setTextWidth(getTextWidth());
    } else {
      setTextWidth(300);
    }
  }, []);

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
          <Truncate lines={1} width={textWidth}>
            {project.name}
          </Truncate>
        </Else>
      </If>

      <div className={styles.fakeTextWrapper}>
        <span
          className={project.name ? styles.fakeText : styles.fakeTextVisible}
          ref={hiddenTextRef}
          onClick={() => {
            if (isMobile) {
              setIsNameUpdating(true);
            }
          }}
        >
          {project.name ? project.name : `Project name #${projectIndex + 1}`}
        </span>
      </div>
    </>
  );
}

InnerOptionName = memo(InnerOptionName, (prevProps, nextProps) => {
  for (let key in prevProps.project) {
    if (prevProps.project[key] != nextProps.project[key]) {
      return false;
    }
  }
  return (
    prevProps.projectIndex == nextProps.projectIndex &&
    prevProps.isNameUpdating == nextProps.isNameUpdating &&
    prevProps.isDropdownOpened == nextProps.isDropdownOpened
  );
});

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
