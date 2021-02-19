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
  const { tasks, isTasksLoaded, tasksByProjectId } = tasksState;

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
      const findSubtasksIds = (_id) =>
        tasks
          .filter((t) => t.root == _id)
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
        dateStart: currentDate,
        dateEnd: afterWeek,
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

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoaded,
        tasksByProjectId,
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
