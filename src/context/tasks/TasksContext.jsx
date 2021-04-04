import { xhr } from "@/helpers/xhr";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import React, { createContext, useReducer, useEffect } from "react";
import usePrevious from "@react-hook/previous";

import TasksReducer from "@/src/context/tasks/TasksReducer";

export const TasksContext = createContext();

export function TasksProvider(props) {
  const router = useRouter();
  const previousRouterId = usePrevious(router.query.id);

  const [tasksState, dispatch] = useReducer(TasksReducer, {
    tasks: [],
    tasksByProjectId: [],
    isTasksLoaded: false,
    whereEditNewTask: "",
    editedTaskId: "",
  });
  const {
    tasks,
    isTasksLoaded,
    tasksByProjectId,
    whereEditNewTask,
    editedTaskId,
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
      } else if (router.query.id != previousRouterId) {
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
      } else {
        dispatch({
          type: "SET_TASKS_BY_PROJECT_ID",
          payload: [],
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (router.query.id) {
      loadTasksByProjectId(router.query.id);
    }
  }, [router.query.id, tasks]);

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
  };

  const deleteTasksByProject = (project) => {
    dispatch({
      type: "DELETE_TASKS_BY_PROJECT",
      payload: { project },
    });
    xhr("/tasks/delete_by_project", { project }, "DELETE");
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
    const tasks = _ids.map((_id, i) => {
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
      const promises = tasks.map(async (task) => {
        await createTask(task);
      });
      await Promise.all(promises);
    }
    await createTasks();
  };

  const updateIsOpened = ({ _id, isOpened }) => {
    dispatch({
      type: "UPDATE_IS_OPENED",
      payload: { _id, isOpened },
    });
  };

  const setWhereEditNewTask = (place) => {
    dispatch({
      type: "SET_WHERE_EDIT_NEW_TASK",
      payload: place,
    });
  };

  const setEditedTaskId = (_id) => {
    dispatch({
      type: "SET_EDITED_TASK_ID",
      payload: _id,
    });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
        tasksByProjectId,
        whereEditNewTask,
        editedTaskId,
        createTask,
        updateTask,
        deleteTask,
        deleteAllTasks,
        createInitialTasks,
        deleteTasksByProject,
        updateIsOpened,
        setWhereEditNewTask,
        setEditedTaskId,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
}
