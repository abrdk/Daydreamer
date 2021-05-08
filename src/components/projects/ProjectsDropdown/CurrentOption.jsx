import { useContext, memo, useState, useEffect } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";
import useMedia from "use-media";
import useEvent from "@react-hook/event";

import ArrowDownSvg from "@/src/components/svg/ArrowDownSvg";
import ArrowUpSvg from "@/src/components/svg/ArrowUpSvg";

import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerCurrentOption({
  isDropdownOpened,
  setIsDropdownOpened,
  currentProjectIndex,
  isUserOwnsProject,
  projectByQueryIdName,
}) {
  const isMobile = useMedia({ maxWidth: 576 });
  const [textWidth, setTextWidth] = useState(185);
  const [isProjectClicked, setIsProjectClicked] = useState(false);

  useEvent(document, "click", (e) => {
    if (e.clientY < 92 && isDropdownOpened && isMobile && !isProjectClicked) {
      setIsDropdownOpened(false);
    }
  });

  const openDropdown = () => {
    setIsProjectClicked(true);
    if (isUserOwnsProject) {
      setIsDropdownOpened(!isDropdownOpened);
    }
  };

  useEffect(() => {
    if (window.innerWidth < 576) {
      setTextWidth(document.querySelector(".projectRoot").clientWidth - 45);
    } else {
      setTextWidth(185);
    }
  }, []);

  useEvent(window, "resize", () => {
    if (window.innerWidth < 576) {
      setTextWidth(document.querySelector(".projectRoot").clientWidth - 45);
    } else {
      setTextWidth(185);
    }
  });

  useEffect(() => {
    if (isProjectClicked) {
      setTimeout(() => {
        setIsProjectClicked(false);
      }, 1);
    }
  }, [isProjectClicked]);

  return (
    <div
      className={
        isDropdownOpened
          ? styles.rootOpened + " projectRoot"
          : styles.root + " projectRoot"
      }
      onClick={openDropdown}
    >
      <Truncate lines={1} width={textWidth}>
        {projectByQueryIdName}
      </Truncate>

      <If condition={isDropdownOpened}>
        <Then>
          <ArrowUpSvg />
        </Then>
        <Else>
          <div className={styles.arrowDown}>
            <ArrowDownSvg />
          </div>
        </Else>
      </If>

      <When condition={projectByQueryIdName == ""}>
        <div className={styles.hiddenName}>{`Project name #${
          currentProjectIndex + 1
        }`}</div>
      </When>
    </div>
  );
}

InnerCurrentOption = memo(
  InnerCurrentOption,
  (prevProps, nextProps) =>
    prevProps.isDropdownOpened == nextProps.isDropdownOpened &&
    prevProps.currentProjectIndex == nextProps.currentProjectIndex &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.projectByQueryIdName == nextProps.projectByQueryIdName
);

export default function CurrentOption(props) {
  const { projectByQueryId, isUserOwnsProject, projects } = useContext(
    ProjectsContext
  );

  const projectByQueryIdName = projectByQueryId.name;
  let currentProjectIndex = 0;
  if (isUserOwnsProject) {
    currentProjectIndex = projects.findIndex(
      (p) => p._id == projectByQueryId._id
    );
  }
  return (
    <InnerCurrentOption
      {...{
        ...props,
        currentProjectIndex,
        isUserOwnsProject,
        projectByQueryIdName,
      }}
    />
  );
}
