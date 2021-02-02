import * as cookie from "cookie";
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

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
}
