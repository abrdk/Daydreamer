import { xhr } from "@/helpers/xhr";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import React, { createContext, useState, useContext } from "react";
import useSWR from "swr";

import { ProjectsContext } from "@/src/context/ProjectsContext";

export const TasksContext = createContext();

export function TasksProvider(props) {
  const { isUserOwnsProject } = useContext(ProjectsContext);

  const router = useRouter();

  const loadTasks = async (url) => {
    try {
      return await xhr(url, {}, "GET");
    } catch (e) {}
  };

  const { data: tasks, error: tasksError, mutate: mutateTasks } = useSWR(
    "/tasks",
    loadTasks
  );

  let currentTasks = null;
  if (tasks && isUserOwnsProject !== false) {
    currentTasks = tasks.filter((t) => t.project == router.query.id);
  }

  const createTask = async (task) => {
    try {
      mutateTasks((tasks) => [...tasks, task], false);
      await xhr("/tasks/create", task, "POST");
    } catch (e) {}
  };

  const updateTask = (task) => {
    try {
      mutateTasks(
        (tasks) => tasks.map((t) => (t._id == task._id ? task : t)),
        false
      );
      xhr("/tasks/update", task, "PUT");
    } catch (e) {}
  };

  const deleteTask = (_id) => {
    try {
      const findSubtasksIds = (_id) =>
        tasks
          .filter((t) => t.root == _id)
          .sort((task1, task2) => task1.order > task2.order)
          .map((t) => [t._id, ...findSubtasksIds(t._id)]);
      const findTaskWithSubtaskIds = (_id) => [_id, ...findSubtasksIds(_id)];

      findTaskWithSubtaskIds(_id)
        .flat()
        .forEach((id) => {
          mutateTasks((tasks) => tasks.filter((t) => t._id != id), false);
          xhr(
            "/tasks/delete",
            {
              _id: id,
            },
            "DELETE"
          );
        });
    } catch (e) {}
  };

  const deleteTasksByProject = (project) => {
    try {
      mutateTasks((tasks) => tasks.filter((t) => t.project != project), false);
      xhr("/tasks/delete_by_project", { project }, "DELETE");
    } catch (e) {}
  };

  const deleteAllTasks = async () => {
    try {
      await xhr("/tasks/delete_all", {}, "DELETE");
    } catch (e) {}
  };

  const createInitialTasks = async ({ project }) => {
    const colors = [
      "FFBC42",
      "258EFA",
      "FFBC42",
      "FFBC42",
      "59CD90",
      "59CD90",
      "258EFA",
    ];
    const datesStart = [
      new Date().setDate(new Date().getDate() - 6),
      new Date().setDate(new Date().getDate() - 1),
      new Date().setDate(new Date().getDate() - 3),
      new Date().setDate(new Date().getDate() + 6),
      new Date().setDate(new Date().getDate() - 2),
      new Date(),
      new Date().setDate(new Date().getDate() + 3),
    ];
    const datesEnd = [
      new Date(),
      new Date().setDate(new Date().getDate() + 5),
      new Date().setDate(new Date().getDate() - 1),
      new Date().setDate(new Date().getDate() + 13),
      new Date().setDate(new Date().getDate() + 7),
      new Date().setDate(new Date().getDate() + 3),
      new Date().setDate(new Date().getDate() + 8),
    ];

    const _ids = [...Array(7).keys()].map(() => nanoid());
    const initialTasks = _ids.map((_id, i) => {
      if (i < 5) {
        return {
          _id,
          name: `Task name #${i + 1}`,
          description: "",
          dateStart: datesStart[i],
          dateEnd: datesEnd[i],
          color: colors[i],
          project,
          root: "",
          order: i,
        };
      }
      return {
        _id,
        name: `Subtask name #${i + 1 - 5}`,
        description: "",
        dateStart: datesStart[i],
        dateEnd: datesEnd[i],
        color: colors[i],
        project,
        root: _ids[2],
        order: i - 5,
      };
    });
    async function createTasks() {
      const promises = initialTasks.map(async (task) => {
        await createTask(task);
      });
      await Promise.all(promises);
    }
    await createTasks();
  };

  const loadTasksByProjectId = async (url, project) => {
    try {
      return await xhr(url, { project }, "POST");
    } catch (e) {}
  };

  const { data: tasksByProjectId, error: tasksByProjectIdError } = useSWR(
    router.query.id && isUserOwnsProject === false
      ? ["/tasks/show", router.query.id]
      : null,
    loadTasksByProjectId
  );

  const [whereEditNewTask, setWhereEditNewTask] = useState("");
  const [editedTaskId, setEditedTaskId] = useState("");
  const [isTaskOpened, setIsTaskOpened] = useState({});

  const updateIsOpened = ({ _id, isOpened }) => {
    setIsTaskOpened((isTaskOpened) => ({ ...isTaskOpened, [_id]: isOpened }));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded:
          tasks !== undefined && !tasksError && !tasksByProjectIdError,
        tasksByProjectId: currentTasks || tasksByProjectId,
        whereEditNewTask,
        editedTaskId,
        isTaskOpened,
        createTask,
        updateTask,
        deleteTask,
        deleteAllTasks,
        createInitialTasks,
        deleteTasksByProject,
        updateIsOpened,
        setWhereEditNewTask,
        setEditedTaskId,
        mutateTasks,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
}
