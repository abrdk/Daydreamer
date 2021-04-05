import { xhr } from "@/helpers/xhr";
import React, { createContext } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

export const ProjectsContext = createContext();

export function ProjectsProvider(props) {
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
  const { data: projectByQueryId, mutate: mutateProjectByQueryId } = useSWR(
    router.query.id && !currentProject
      ? ["/projects/show", router.query.id]
      : null,
    loadProject
  );

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isProjectsLoaded: !!projects,
        projectByQueryId: currentProject || projectByQueryId,
        mutateProjectByQueryId,
        createProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
        mutateProjects,
        mutateProjectByQueryId,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
}
