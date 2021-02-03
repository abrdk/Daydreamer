import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
import { xhr } from "../../../helpers/xhr";
import { v4 as uuidv4 } from "uuid";

import React, { createContext, useReducer, useEffect } from "react";
import TasksReducer from "./TasksReducer";

export const TasksContext = createContext();

export function TasksProvider(props) {
  const [tasksState, dispatch] = useReducer(TasksReducer, {
    tasks: [],
    isTasksLoaded: false,
  });

  const { tasks, isTasksLoaded } = tasksState;

  const loadTasks = async () => {
    try {
      if (cookie.parse(document.cookie).ganttToken) {
        const res = await xhr("/tasks/show", {}, "GET");

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

  const createTask = async ({
    name,
    description,
    dateStart,
    dateEnd,
    color,
    owner,
    project,
    root,
    order,
  }) => {
    try {
      const fakeId = uuidv4();
      dispatch({
        type: "ADD_TASK",
        payload: {
          _id: fakeId,
          name,
          description,
          dateStart,
          dateEnd,
          color,
          owner,
          project,
          root,
          order,
        },
      });

      const res = await xhr(
        "/tasks/create",
        {
          name,
          description,
          dateStart,
          dateEnd,
          color,
          project,
          root,
          order,
        },
        "POST"
      );
      dispatch({
        type: "UPDATE_TASK_ID",
        payload: { _id: fakeId, realId: res.task._id },
      });
      return {
        _id: res.task._id,
      };
    } catch (e) {}
  };

  const updateTask = async ({
    _id,
    name,
    description,
    dateStart,
    dateEnd,
    color,
    root,
    order,
  }) => {
    try {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          _id,
          name,
          description,
          dateStart,
          dateEnd,
          color,
          root,
          order,
        },
      });

      const res = await xhr(
        "/tasks/update",
        {
          id,
          name,
          description,
          dateStart,
          dateEnd,
          color,
          root,
          order,
        },
        "PUT"
      );
    } catch (e) {}
  };

  const deleteTask = async (_id) => {
    try {
      dispatch({
        type: "DELETE_TASK",
        payload: { _id },
      });

      const res = await xhr(
        "/tasks/delete",
        {
          id: _id,
        },
        "DELETE"
      );
    } catch (e) {}
  };

  const deleteAllTasks = async () => {
    try {
      await xhr("/tasks/delete_all", {}, "DELETE");
    } catch (e) {}
  };

  const createInitialTasks = async ({ project }) => {
    const currentDate = new Date();
    let afterWeek = currentDate;
    afterWeek.setDate(afterWeek.getDate() + 7);

    const token = cookie.parse(document.cookie).ganttToken;
    const user = jwt.verify(token, "jwtSecret");

    createTask({
      name: "Task name #1",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "FFBC42",
      owner: user.id,
      project,
      root: "",
      order: 0,
    });
    createTask({
      name: "Task name #2",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "258EFA",
      owner: user.id,
      project,
      root: "",
      order: 1,
    });
    createTask({
      name: "Task name #4",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "FFBC42",
      owner: user.id,
      project,
      root: "",
      order: 3,
    });
    createTask({
      name: "Task name #5",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "59CD90",
      owner: user.id,
      project,
      root: "",
      order: 4,
    });

    const resTask = await createTask({
      name: "Task name #3",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "FFBC42",
      owner: user.id,
      project,
      root: "",
      order: 2,
    });

    await createTask({
      name: "Subtask name #1",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "FFBC42",
      owner: user.id,
      project,
      root: resTask._id,
      order: 0,
    });

    await createTask({
      name: "Subtask name #2",
      description: "",
      dateStart: currentDate,
      dateEnd: afterWeek,
      color: "59CD90",
      owner: user.id,
      project,
      root: resTask._id,
      order: 1,
    });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        deleteAllTasks,
        createInitialTasks,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
}
