import { useContext, useState, useEffect } from "react";
import styles from "@/styles/projectsDropdown.module.scss";
import Truncate from "react-truncate";
import { If, Then, Else, When } from "react-if";

import ArrowDownSvg from "@/src/components/svg/ArrowDownSvg";
import ArrowUpSvg from "@/src/components/svg/ArrowUpSvg";

import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function CurrentOption({
  isDropdownOpened,
  setIsDropdownOpened,
}) {
  const { projects, projectByQueryId, isUserOwnsProject } = useContext(
    ProjectsContext
  );
  const [projectIndex, setProjectIndex] = useState(0);

  const openDropdown = () => {
    if (isUserOwnsProject) {
      setIsDropdownOpened(!isDropdownOpened);
    }
  };

  useEffect(() => {
    setProjectIndex(projects.findIndex((p) => p._id == projectByQueryId._id));
  }, [projectByQueryId._id]);

  return (
    <div
      className={isDropdownOpened ? styles.rootOpened : styles.root}
      onClick={openDropdown}
    >
      <Truncate lines={1} width={185}>
        {projectByQueryId.name}
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

      <When condition={projectByQueryId.name == ""}>
        <div className={styles.hiddenName}>{`Project name #${
          projectIndex + 1
        }`}</div>
      </When>
    </div>
  );
}
