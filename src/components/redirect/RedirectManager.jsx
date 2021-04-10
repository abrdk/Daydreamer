import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { UsersContext } from "@/src/context/UsersContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

export default function RedirectManager({ children }) {
  const router = useRouter();

  const { isUserLoaded, user, setIsUserLogout } = useContext(UsersContext);
  const { isProjectsLoaded, projects } = useContext(ProjectsContext);

  useEffect(() => {
    if (!isUserLoaded || !isProjectsLoaded) {
      return;
    }
    if (router.pathname == "/") {
      if (!user._id) {
        router.push("/signup");
        return;
      }
      let currentProject = projects.find((p) => p.isCurrent);
      if (!currentProject) {
        currentProject = project[0];
      }
      if (currentProject) {
        router.push(`/gantt/${currentProject._id}`);
      }
    } else if (router.pathname == "/signup" || router.pathname == "/login") {
      setIsUserLogout(false);
      if (user._id && projects.length) {
        let currentProject = projects.find((p) => p.isCurrent);
        if (!currentProject) {
          currentProject = projects[0];
        }
        if (currentProject) {
          router.push(`/gantt/${currentProject._id}`);
        }
      }
    }
  }, [isUserLoaded, isProjectsLoaded, router.pathname, projects, user]);

  return children;
}
