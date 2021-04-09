import calendarStyles from "@/styles/calendar.module.scss";
import { useContext } from "react";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusSvg from "@/src/components/svg/PlusSvg";
import PencilIcon from "@/src/components/svg/PencilSvg";
import ArrowDown from "@/src/components/svg/ArrowDownSvg";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function SubtaskTooltip({ task, globalCursor }) {
  const {
    updateIsOpened,
    tasksByProjectId,
    createTask,
    setWhereEditNewTask,
    editedTaskId,
    setEditedTaskId,
    isTaskOpened,
  } = useContext(TasksContext);

  const subtasks = tasksByProjectId
    .filter((t) => t.root == task._id)
    .sort((task1, task2) => task1.order > task2.order);

  const { isUserOwnsProject } = useContext(ProjectsContext);

  const createSubtask = () => {
    const order = subtasks.length;

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
      <When condition={subtasks.length}>
        <div className={calendarStyles.openSubtasksWrapper}>
          <div
            className={calendarStyles.openSubtasksIcon}
            onClick={() =>
              updateIsOpened({
                _id: task._id,
                isOpened: !isTaskOpened[task._id],
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
