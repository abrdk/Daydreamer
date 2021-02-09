import { xhr } from "@/helpers/xhr";
import { nanoid } from "nanoid";
import useSWR from "swr";
import React, { createContext, useReducer, useEffect } from "react";

import TasksReducer from "@/src/context/tasks/TasksReducer";

export const TasksContext = createContext();

export function TasksProvider(props) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/tasks/`, fetcher);
  useEffect(() => {
    if (!error && data) {
      if (data.message == "ok") {
        dispatch({
          type: "SET_TASKS",
          payload: data.tasks,
        });
      } else {
        dispatch({
          type: "SET_TASKS",
          payload: [],
        });
      }
    }
  }, [data, error]);

  const [tasksState, dispatch] = useReducer(TasksReducer, {
    tasks: [],
    isTasksLoaded: false,
  });
  const colors = ["258EFA", "FFBC42", "59CD90", "D06BF3", "66CEDC", "FF5B79"];
  const { tasks, isTasksLoaded } = tasksState;

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

  const deleteTask = async (_id) => {
    try {
      dispatch({
        type: "DELETE_TASK",
        payload: { _id },
      });

      await xhr(
        "/tasks/delete",
        {
          _id,
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

    const _ids = [...Array(7).keys()].map(() => nanoid());
    const newTasks = _ids.map((_id, i) => {
      if (i < 5) {
        return {
          _id,
          name: `Task name #${i + 1}`,
          description: "",
          dateStart: currentDate,
          dateEnd: afterWeek,
          color: colors[Math.floor(Math.random() * colors.length)],
          project,
          root: "",
          order: i,
        };
      }
      return {
        _id,
        name: `Subtask name #${i + 1 - 5}`,
        description: "",
        dateStart: currentDate,
        dateEnd: afterWeek,
        color: colors[Math.floor(Math.random() * colors.length)],
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

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
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
