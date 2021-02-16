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

  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }

  useEffect(() => {
    if (currentProject && currentProject._id != router.query.id) {
      router.push(`/gantt/${currentProject._id}`);
    }
  }, [currentProject, router.query.id]);

  useEffect(() => {
    const updateCurrentProject = async () => {
      const project = projects.find((p) => p._id == router.query.id);
      if (project) {
        await Promise.all([
          updateProject({ ...currentProject, isCurrent: false }),
          updateProject({ ...project, isCurrent: true }),
        ]);
      }
    };

    if (
      currentProject &&
      currentProject._id != router.query.id &&
      isProjectsLoaded
    ) {
      updateCurrentProject();
    }
  }, [isProjectsLoaded]);

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
