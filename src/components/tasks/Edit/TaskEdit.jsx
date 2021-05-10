import React, { useContext, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import { When } from "react-if";
import useMedia from "use-media";

import CalendarTooltip from "@/src/components/tasks/Edit/CalendarTooltip";
import EditNameForm from "@/src/components/tasks/Edit/EditNameForm";
import EditDescriptionForm from "@/src/components/tasks/Edit/EditDescriptionForm";
import ColorPicker from "@/src/components/tasks/Edit/ColorPicker";
import DeleteTaskIcon from "@/src/components/tasks/Edit/DeleteTaskIcon";
import IconCreateSubtask from "@/src/components/tasks/Edit/IconCreateSubtask";

import CrossSvg from "@/src/components/svg/CrossSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";
import { OptionsContext } from "@/src/context/OptionsContext";

function InnerTaskEdit({
  task,
  isUserOwnsProject,
  isMenuOpened,
  setEditedTaskId,
}) {
  const isMobilePortrait = useMedia({ maxWidth: 576 });
  const isMobileLandscape = useMedia({ minWidth: 576, maxWidth: 1200 });

  const getEditAreaWidth = () => {
    if (isMobilePortrait || isMobileLandscape) {
      return "100vw";
    }
    if (isMenuOpened) {
      return "calc(100vw - 335px)";
    }
    return "100vw";
  };

  const getEditAreaLeft = () => {
    if (isMobilePortrait) {
      if (isMenuOpened) {
        return 0;
      }
      return "100vw";
    }
    if (isMobileLandscape) {
      if (isMenuOpened) {
        return 0;
      }
      return "335px";
    }
    return "335px";
  };

  if (task && Object.keys(task).length) {
    return (
      <div
        className={
          isUserOwnsProject
            ? styles.wrapper
            : `${styles.wrapper} ${styles.wrapperSmallPadding}`
        }
        style={{
          width: getEditAreaWidth(),
          left: getEditAreaLeft(),
        }}
        id="editTask"
      >
        <div className={styles.inputsWrapper}>
          <div className={styles.topInputsWrapper}>
            <EditNameForm task={task} />
            <CalendarTooltip task={task} />
          </div>
          <EditDescriptionForm task={task} />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.closeWrapper}>
            <div
              className={styles.crossIcon}
              onClick={() => setEditedTaskId("")}
            >
              <CrossSvg />
            </div>
          </div>
          <When condition={isUserOwnsProject}>
            <ColorPicker task={task} />
            <DeleteTaskIcon task={task} />
          </When>
        </div>

        <IconCreateSubtask task={task} />
      </div>
    );
  } else {
    return <></>;
  }
}

InnerTaskEdit = memo(InnerTaskEdit, (prevProps, nextProps) => {
  if (
    Object.keys(prevProps.task).length != Object.keys(nextProps.task).length
  ) {
    return false;
  }
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.isMenuOpened == nextProps.isMenuOpened
  );
});

export default function TaskEdit() {
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const { isMenuOpened } = useContext(OptionsContext);

  const { tasksByProjectId, editedTaskId, setEditedTaskId } = useContext(
    TasksContext
  );

  const task = tasksByProjectId.find((t) => t._id == editedTaskId);

  return (
    <InnerTaskEdit
      {...{
        task: task ? task : {},
        isUserOwnsProject,
        isMenuOpened,
        setEditedTaskId,
      }}
    />
  );
}
