import { xhr } from "@/helpers/xhr";
import React, { createContext, useReducer, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

import ProjectsReducer from "@/src/context/projects/ProjectsReducer";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const router = useRouter();
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
    projectByQueryId: {},
    isProjectsLoaded: false,
  });
  const { projects, isProjectsLoaded, projectByQueryId } = projectsState;

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

      await xhr(
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

      await xhr("/projects/update", project, "PUT");
    } catch (e) {}
  };

  const deleteProject = async (_id) => {
    try {
      dispatch({
        type: "DELETE_PROJECT",
        payload: { _id },
      });

      await xhr(
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

  const loadProjectByQuery = async (_id) => {
    try {
      const project = projects.find((p) => p._id == _id);
      if (project) {
        dispatch({
          type: "SET_PROJECT_BY_QUERY_ID",
          payload: project,
        });
      } else {
        const res = await xhr("/projects/show", { _id }, "POST");
        if (res.message == "ok" && res.project) {
          dispatch({
            type: "SET_PROJECT_BY_QUERY_ID",
            payload: res.project,
          });
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (router.query.id) {
      loadProjectByQuery(router.query.id);
    }
  }, [router.query.id, projects]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isProjectsLoaded,
        projectByQueryId,
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
