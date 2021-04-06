import { xhr } from "@/helpers/xhr";
import React, { createContext, useContext } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { UsersContext } from "@/src/context/UsersContext";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
  const { user } = useContext(UsersContext);

  const router = useRouter();

  const loadProjects = async (url) => {
    try {
      return await xhr(url, {}, "GET");
    } catch (e) {}
  };
  const {
    data: projects,
    error: projectsError,
    mutate: mutateProjects,
  } = useSWR("/projects", loadProjects);

  let currentProject = null;
  if (projects) {
    currentProject = projects.find((p) => p._id == router.query.id);
  }

  const createProject = async (newProject) => {
    try {
      mutateProjects((projects) => [...projects, newProject], false);
      await xhr("/projects/create", newProject, "POST");
    } catch (e) {}
  };

  const updateProject = (project) => {
    try {
      mutateProjects(
        (projects) => projects.map((p) => (p._id == project._id ? project : p)),
        false
      );

      xhr("/projects/update", project, "PUT");
    } catch (e) {}
  };

  const deleteProject = (_id) => {
    try {
      mutateProjects((projects) => projects.filter((p) => p._id != _id), false);

      xhr(
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

  const loadProject = async (url, _id) => {
    try {
      return await xhr(url, { _id }, "POST");
    } catch (e) {}
  };

  const { data: projectByQueryId, error: projectByQueryIdError } = useSWR(
    router.query.id && isUserOwnsProject === false
      ? ["/projects/show", router.query.id]
      : null,
    loadProject
  );

  const isUserOwnsProject = () => {
    if (!user) {
      return undefined;
    }
    if (currentProject) {
      return currentProject.owner == user._id;
    }
    if (projectByQueryId) {
      return projectByQueryId.owner == user._id;
    }
    return undefined;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isProjectsLoaded:
          projects !== undefined && !projectsError && !projectByQueryIdError,
        projectByQueryId: currentProject || projectByQueryId,
        isUserOwnsProject: isUserOwnsProject(),
        createProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
        mutateProjects,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
}
