import { xhr } from "@/helpers/xhr";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import React, { createContext, useReducer, useEffect } from "react";

import TasksReducer from "@/src/context/tasks/TasksReducer";

export const TasksContext = createContext();

export function TasksProvider(props) {
  const router = useRouter();
  const [tasksState, dispatch] = useReducer(TasksReducer, {
    tasks: [],
    tasksByProjectId: [],
    sortedTasksIds: [],
    isSorting: false,
    isTasksLoaded: false,
  });
  const colors = [
    "FFBC42",
    "258EFA",
    "FFBC42",
    "FFBC42",
    "59CD90",
    "59CD90",
    "258EFA",
  ];
  const {
    tasks,
    isTasksLoaded,
    tasksByProjectId,
    sortedTasksIds,
    isSorting,
  } = tasksState;

  const findSubtasksIds = (_id) =>
    tasksByProjectId
      .filter((t) => t.root == _id)
      .sort((task1, task2) => task1.order > task2.order)
      .map((t) => [t._id, ...findSubtasksIds(t._id)]);

  const findTaskWithSubtaskIds = (_id) => [_id, ...findSubtasksIds(_id)];

  function flatten(array, mutable) {
    let toString = Object.prototype.toString;
    let arrayTypeStr = "[object Array]";
    let result = [];
    let nodes = (mutable && array) || array.slice();
    let node;
    if (!array.length) {
      return result;
    }
    node = nodes.pop();
    do {
      if (toString.call(node) === arrayTypeStr) {
        nodes.push.apply(nodes, node);
      } else {
        result.push(node);
      }
    } while (nodes.length && (node = nodes.pop()) !== undefined);
    result.reverse();
    return result;
  }

  const loadTasks = async () => {
    try {
      const res = await xhr("/tasks/", {}, "GET");
      if (res.message == "ok") {
        dispatch({
          type: "SET_TASKS",
          payload: res.tasks,
        });
      } else {
        dispatch({
          type: "SET_TASKS",
          payload: [],
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasksByProjectId = async (project) => {
    try {
      const tasksByProject = tasks.filter((t) => t.project == project);
      if (tasksByProject.length) {
        dispatch({
          type: "SET_TASKS_BY_PROJECT_ID",
          payload: tasksByProject,
        });
      } else {
        const res = await xhr("/tasks/show", { project }, "POST");
        if (res.message == "ok" && res.tasks) {
          dispatch({
            type: "SET_TASKS_BY_PROJECT_ID",
            payload: res.tasks,
          });
        } else {
          dispatch({
            type: "SET_TASKS_BY_PROJECT_ID",
            payload: [],
          });
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (router.query.id) {
      loadTasksByProjectId(router.query.id);
    }
  }, [router.query.id, tasks]);

  useEffect(() => {
    dispatch({
      type: "SET_SORTED_TASKS_IDS",
      payload: flatten(
        tasksByProjectId
          .filter((t) => t.root == "")
          .sort((task1, task2) => task1.order > task2.order)
          .map((t) => flatten(findTaskWithSubtaskIds(t._id)))
      ),
    });
  }, [tasksByProjectId]);

  const createTask = async (task) => {
    try {
      dispatch({
        type: "ADD_TASK",
        payload: task,
      });

      await xhr("/tasks/create", task, "POST");
    } catch (e) {}
  };

  const updateTask = async (task) => {
    try {
      dispatch({
        type: "UPDATE_TASK",
        payload: task,
      });

      await xhr("/tasks/update", task, "PUT");
    } catch (e) {}
  };

  const deleteTask = (_id) => {
    try {
      flatten(findTaskWithSubtaskIds(_id)).forEach((id) => {
        dispatch({
          type: "DELETE_TASK",
          payload: { _id: id },
        });
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

  const deleteTasksByProject = async (project) => {
    try {
      dispatch({
        type: "DELETE_TASKS_BY_PROJECT",
        payload: { project },
      });

      await xhr("/tasks/delete_by_project", { project }, "DELETE");
    } catch (e) {}
  };

  const deleteAllTasks = async () => {
    try {
      await xhr("/tasks/delete_all", {}, "DELETE");
    } catch (e) {}
  };

  const createInitialTasks = async ({ project }) => {
    const today = new Date();
    const datesStart = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    ];
    const datesEnd = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
    ];

    const _ids = [...Array(7).keys()].map(() => nanoid());
    const newTasks = _ids.map((_id, i) => {
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

    await Promise.all([
      createTask(newTasks[0]),
      createTask(newTasks[1]),
      createTask(newTasks[2]),
      createTask(newTasks[3]),
      createTask(newTasks[4]),
      createTask(newTasks[5]),
      createTask(newTasks[6]),
    ]);
  };

  const setIsSorting = (bool) => {
    dispatch({
      type: "SET_IS_SORTING",
      payload: bool,
    });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
        tasksByProjectId,
        sortedTasksIds,
        isSorting,
        setIsSorting,
        createTask,
        updateTask,
        deleteTask,
        deleteAllTasks,
        createInitialTasks,
        deleteTasksByProject,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
}