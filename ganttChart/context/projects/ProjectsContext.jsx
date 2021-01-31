import * as cookie from "cookie";
import { xhr } from "../../../helpers/xhr";
import { v4 as uuidv4 } from "uuid";

import React, { createContext, useReducer, useEffect } from "react";
import ProjectsReducer from "./ProjectsReducer";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const [projectsState, dispatch] = useReducer(ProjectsReducer, {
    projects: [],
    isProjectsLoaded,
  });

  const { projects, isProjectsLoaded } = projectsState;

  const loadProjects = async () => {
    if (document.cookie) {
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        res = await xhr(
          "/projects/show",
          {
            token,
          },
          "POST"
        );

        dispatch({
          type: "SET_PROJECTS",
          payload: res.projects,
        });
      } catch (e) {}
    }
  };

  const createProject = async () => {
    if (document.cookie) {
      const fakeId = uuidv4();
      dispatch({
        type: "ADD_PROJECT",
        payload: {
          id: fakeId,
          name: `Project name #${projects.length + 1}`,
          isCurrent: false,
        },
      });
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        res = await xhr(
          "/projects/create",
          {
            token,
            name: `Project name #${projects.length}`,
          },
          "POST"
        );
        dispatch({
          type: "UPDATE_PROJECT_ID",
          payload: { id: fakeId, realId: res._id },
        });
      } catch (e) {}
    }
  };

  const updateProject = async ({ id, name, isCurrent }) => {
    if (document.cookie) {
      dispatch({
        type: "UPDATE_PROJECT",
        payload: { id, name, isCurrent },
      });
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        res = await xhr(
          "/projects/update",
          {
            token,
            id,
            name,
            isCurrent,
          },
          "PUT"
        );
      } catch (e) {}
    }
  };

  const deleteProject = async (id) => {
    if (document.cookie) {
      dispatch({
        type: "DELETE_PROJECT",
        payload: id,
      });
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        res = await xhr(
          "/projects/delete",
          {
            token,
            id,
          },
          "DELETE"
        );
      } catch (e) {}
    }
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
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
}
