import * as cookie from "cookie";
import { xhr } from "../../../helpers/xhr";
import { v4 as uuidv4 } from "uuid";

import React, { createContext, useReducer, useEffect } from "react";
import ProjectsReducer from "./ProjectsReducer";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const [projectsState, dispatch] = useReducer(ProjectsReducer, {
    projects: [],
    isProjectsLoaded: false,
  });

  const { projects, isProjectsLoaded } = projectsState;

  const loadProjects = async () => {
    try {
      if (cookie.parse(document.cookie).ganttToken) {
        const res = await xhr("/projects/show", {}, "GET");

        dispatch({
          type: "SET_PROJECTS",
          payload: res.projects,
        });
      } else {
        dispatch({
          type: "SET_PROJECTS",
          payload: [],
        });
      }
    } catch (e) {}
  };

  const createProject = async (name) => {
    try {
      let isCurrent;
      if (projects.length) {
        isCurrent = false;
      } else {
        isCurrent = true;
      }
      const fakeId = uuidv4();
      dispatch({
        type: "ADD_PROJECT",
        payload: {
          _id: fakeId,
          name,
          isCurrent,
        },
      });

      const res = await xhr(
        "/projects/create",
        {
          name,
          isCurrent,
        },
        "POST"
      );
      dispatch({
        type: "UPDATE_PROJECT_ID",
        payload: { _id: fakeId, realId: res.project._id },
      });
    } catch (e) {}
  };

  const updateProject = async ({ _id, name, isCurrent }) => {
    try {
      dispatch({
        type: "UPDATE_PROJECT",
        payload: { _id, name, isCurrent },
      });

      const res = await xhr(
        "/projects/update",
        {
          id: _id,
          name,
          isCurrent,
        },
        "PUT"
      );
    } catch (e) {}
  };

  const deleteProject = async (_id) => {
    try {
      dispatch({
        type: "DELETE_PROJECT",
        payload: { _id },
      });

      const token = cookie.parse(document.cookie).ganttToken;
      const res = await xhr(
        "/projects/delete",
        {
          id: _id,
        },
        "DELETE"
      );

      return true;
    } catch (e) {}
  };

  const deleteAllProjects = async () => {
    try {
      const res = await xhr("/projects/delete_all", {}, "DELETE");
      return true;
    } catch (e) {}
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isProjectsLoaded,
        createProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
}
