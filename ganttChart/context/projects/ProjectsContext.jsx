import { xhr } from "../../../helpers/xhr";
import React, { createContext, useReducer, useEffect } from "react";
import useSWR from "swr";

import ProjectsReducer from "./ProjectsReducer";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/projects/`, fetcher);
  useEffect(() => {
    if (!error && data) {
      if (data.message == "ok") {
        dispatch({
          type: "SET_PROJECTS",
          payload: data.projects,
        });
      } else {
        dispatch({
          type: "SET_PROJECTS",
          payload: [],
        });
      }
    }
  }, [data, error]);

  const [projectsState, dispatch] = useReducer(ProjectsReducer, {
    projects: [],
    isProjectsLoaded: false,
  });
  const { projects, isProjectsLoaded } = projectsState;

  const createProject = async (project) => {
    try {
      let isCurrent;
      if (projects.length) {
        isCurrent = false;
      } else {
        isCurrent = true;
      }

      dispatch({
        type: "ADD_PROJECT",
        payload: {
          ...project,
          isCurrent,
        },
      });

      const res = await xhr(
        "/projects/create",
        {
          ...project,
          isCurrent,
        },
        "POST"
      );
    } catch (e) {}
  };

  const updateProject = async (project) => {
    try {
      dispatch({
        type: "UPDATE_PROJECT",
        payload: project,
      });

      const res = await xhr("/projects/update", project, "PUT");
    } catch (e) {}
  };

  const deleteProject = async (_id) => {
    try {
      dispatch({
        type: "DELETE_PROJECT",
        payload: { _id },
      });

      const res = await xhr(
        "/projects/delete",
        {
          _id,
        },
        "DELETE"
      );
    } catch (e) {}
  };

  const deleteAllProjects = async () => {
    try {
      await xhr("/projects/delete_all", {}, "DELETE");
    } catch (e) {}
  };

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
