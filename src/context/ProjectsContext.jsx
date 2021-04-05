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
    } catch (e) {
      return [];
    }
  };
  const { data: projects, mutate: mutateProjects } = useSWR(
    "/projects",
    loadProjects
  );

  let currentProject = null;
  if (projects) {
    currentProject = projects.find((p) => p._id == router.query.id);
  }

  const createProject = async (project) => {
    const isCurrent = projects.length == 0;
    const newProject = {
      isCurrent,
      ...project,
    };

    mutateProjects((projects) => [...projects, newProject], false);
    await xhr("/projects/create", newProject, "POST");
  };

  const updateProject = (project) => {
    mutateProjects(
      (projects) => projects.map((p) => (p._id == project._id ? project : p)),
      false
    );

    xhr("/projects/update", project, "PUT");
  };

  const deleteProject = (_id) => {
    mutateProjects((projects) => projects.filter((p) => p._id != _id), false);

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

  const loadProject = async (url, _id) => {
    try {
      return await xhr(url, { _id }, "POST");
    } catch (e) {
      return {};
    }
  };
  const { data: projectByQueryId } = useSWR(
    router.query.id && !currentProject
      ? ["/projects/show", router.query.id]
      : null,
    loadProject
  );

  const isUserOwnsProject = () => {
    if (!user) {
      return false;
    }
    if (currentProject) {
      return currentProject.owner == user._id;
    }
    if (projectByQueryId) {
      return projectByQueryId.owner == user._id;
    }
    return false;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isProjectsLoaded: !!projects,
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
