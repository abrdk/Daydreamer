import calendarStyles from "@/styles/calendar.module.scss";
import { useContext } from "react";
import { nanoid } from "nanoid";
import { When } from "react-if";

import { TasksContext } from "@/src//context/tasks/TasksContext";
import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function SubtaskTooltip({ task, setMenu, setEditedTask }) {
  const { updateIsOpened, tasksByProjectId, createTask } = useContext(
    TasksContext
  );
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
    updateIsOpened({ _id: task._id, isOpened: true });
    setMenu(true);
    createTask({
      ...task,
      _id: newSubtaskId,
      name: "",
      description: "",
      root: task._id,
      order,
    });
    setEditedTask(newSubtaskId);
  };

  return (
    <>
      <When condition={subtasks.length}>
        <div className={calendarStyles.openSubtasksWrapper}>
          <div
            className={calendarStyles.openSubtasksIcon}
            onClick={() =>
              updateIsOpened({ _id: task._id, isOpened: !task.isOpened })
            }
          >
            <img src="/img/arrowDownLine.svg" alt=" " />
          </div>
        </div>
      </When>
      <When condition={projectByQueryId.owner == userCtx._id}>
        <div className={calendarStyles.addSubtaskWrapper}>
          <div
            className={calendarStyles.addSubtaskIcon}
            onClick={createSubtask}
          >
            <img src="/img/plusLine.svg" alt=" " />
          </div>
        </div>
      </When>
    </>
  );
}
