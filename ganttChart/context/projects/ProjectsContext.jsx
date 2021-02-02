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
    if (document.cookie) {
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        const res = await xhr(
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
    } else {
      dispatch({
        type: "SET_PROJECTS",
        payload: [],
      });
    }
  };

  const createProject = async (name) => {
    if (document.cookie) {
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
      try {
        const token = cookie.parse(document.cookie).ganttToken;

        let res;
        if (name === "") {
          res = await xhr(
            "/projects/create",
            {
              token,
              isCurrent,
            },
            "POST"
          );
        } else {
          res = await xhr(
            "/projects/create",
            {
              token,
              name,
              isCurrent,
            },
            "POST"
          );
        }
        dispatch({
          type: "UPDATE_PROJECT_ID",
          payload: { _id: fakeId, realId: res.project._id },
        });
      } catch (e) {}
    }
  };

  const updateProject = async ({ _id, name, isCurrent }) => {
    if (document.cookie) {
      dispatch({
        type: "UPDATE_PROJECT",
        payload: { _id, name, isCurrent },
      });
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        const res = await xhr(
          "/projects/update",
          {
            token,
            id: _id,
            name,
            isCurrent,
          },
          "PUT"
        );
      } catch (e) {}
    }
  };

  const deleteProject = async (_id) => {
    if (document.cookie) {
      dispatch({
        type: "DELETE_PROJECT",
        payload: { _id },
      });
      try {
        const token = cookie.parse(document.cookie).ganttToken;
        const res = await xhr(
          "/projects/delete",
          {
            token,
            id: _id,
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
