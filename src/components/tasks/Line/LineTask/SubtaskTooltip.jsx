import calendarStyles from "@/styles/calendar.module.scss";
import { useContext, memo } from "react";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusSvg from "@/src/components/svg/PlusSvg";
import PencilIcon from "@/src/components/svg/PencilSvg";
import ArrowDown from "@/src/components/svg/ArrowDownSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerSubtaskTooltip({
  task,
  globalCursor,
  isUserOwnsProject,
  editedTaskId,
  numOfSubtasks,
  updateIsOpened,
  createTask,
  setWhereEditNewTask,
  setEditedTaskId,
}) {
  const createSubtask = () => {
    const order = numOfSubtasks;

    const newSubtaskId = nanoid();
    if (editedTaskId) {
      setTimeout(() => setEditedTaskId(newSubtaskId), 100);
      setWhereEditNewTask("edit");
    } else {
      setWhereEditNewTask("calendar");
    }
    updateIsOpened({ _id: task._id, isOpened: true });
    createTask({
      ...task,
      _id: newSubtaskId,
      name: "",
      description: "",
      root: task._id,
      order,
    });
  };

  return (
    <When condition={globalCursor == ""}>
      <When condition={numOfSubtasks}>
        <div className={calendarStyles.openSubtasksWrapper}>
          <div
            className={calendarStyles.openSubtasksIcon}
            onClick={() =>
              updateIsOpened({
                _id: task._id,
                isOpened: true,
              })
            }
          >
            <ArrowDown />
          </div>
        </div>
      </When>

      <When condition={isUserOwnsProject}>
        <div className={calendarStyles.addSubtaskWrapper}>
          <div
            className={calendarStyles.addSubtaskIcon}
            onClick={createSubtask}
          >
            <PlusSvg />
          </div>
        </div>
      </When>

      <div className={calendarStyles.editTaskIconWrapper}>
        <div
          className={calendarStyles.editTaskIcon}
          onClick={() => {
            if (editedTaskId == task._id) {
              setEditedTaskId("");
            } else {
              setEditedTaskId(task._id);
            }
          }}
        >
          <PencilIcon />
        </div>
      </div>
    </When>
  );
}

InnerSubtaskTooltip = memo(InnerSubtaskTooltip, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return (
    prevProps.globalCursor == nextProps.globalCursor &&
    prevProps.isUserOwnsProject == nextProps.isUserOwnsProject &&
    prevProps.editedTaskId == nextProps.editedTaskId &&
    prevProps.numOfSubtasks == nextProps.numOfSubtasks
  );
});

export default function SubtaskTooltip({ task, globalCursor }) {
  const {
    updateIsOpened,
    tasksByProjectId,
    createTask,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
  } = useContext(TasksContext);
  const { isUserOwnsProject } = useContext(ProjectsContext);

  const subtasks = tasksByProjectId
    .filter((t) => t.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  return (
    <InnerSubtaskTooltip
      {...{
        task,
        globalCursor,
        isUserOwnsProject,
        editedTaskId,
        updateIsOpened,
        numOfSubtasks: subtasks.length,
        createTask,
        setWhereEditNewTask,
        setEditedTaskId,
      }}
    />
  );
}
