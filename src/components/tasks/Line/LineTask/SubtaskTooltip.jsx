import calendarStyles from "@/styles/calendar.module.scss";
import { useContext } from "react";
import { nanoid } from "nanoid";
import { When } from "react-if";

import PlusIcon from "@/src/components/svg/PlusIcon";
import PencilIcon from "@/src/components/svg/PencilIcon";
import ArrowDown from "@/src/components/svg/ArrowDown";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function SubtaskTooltip({ task }) {
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

  const { projectByQueryId } = useContext(ProjectsContext);
  const userCtx = useContext(UsersContext);

  const createSubtask = () => {
    let order = 0;
    if (subtasks.length) {
      order = subtasks[subtasks.length - 1].order + 1;
    }

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
    <>
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

      <When condition={projectByQueryId.owner == userCtx._id}>
        <div className={calendarStyles.addSubtaskWrapper}>
          <div
            className={calendarStyles.addSubtaskIcon}
            onClick={createSubtask}
          >
            <PlusIcon />
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
    </>
  );
}
