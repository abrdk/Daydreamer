import { xhr } from "@/helpers/xhr";
import React, { createContext, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import usePrevious from "@react-hook/previous";

import ProjectsReducer from "@/src/context/projects/ProjectsReducer";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const router = useRouter();
  const previousRouterId = usePrevious(router.query.id);
  const [projectsState, dispatch] = useReducer(ProjectsReducer, {
    projects: [],
    projectByQueryId: {},
    isProjectsLoaded: false,
  });

  const { projects, isProjectsLoaded, projectByQueryId } = projectsState;

  const loadProjects = async () => {
    try {
      const res = await xhr("/projects", {}, "GET");
      if (res.message == "ok") {
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

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (project) => {
    try {
      const isCurrent = projects.length == 0;

      dispatch({
        type: "ADD_PROJECT",
        payload: {
          isCurrent,
          ...project,
        },
      });

      await xhr(
        "/projects/create",
        {
          isCurrent,
          ...project,
        },
        "POST"
      );
    } catch (e) {}
  };

  const updateProject = (project) => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: project,
    });

    xhr("/projects/update", project, "PUT");
  };

  const deleteProject = (_id) => {
    dispatch({
      type: "DELETE_PROJECT",
      payload: { _id },
    });

    xhr(
      "/projects/delete",
      {
        _id,
      },
      "DELETE"
    );
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
      } else if (router.query.id != previousRouterId) {
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
