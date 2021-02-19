import Head from "next/head";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { UsersContext } from "@/src/context/users/UsersContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function Home() {
  const router = useRouter();

  const { isUserLoaded, _id } = useContext(UsersContext);
  const { projects } = useContext(ProjectsContext);
  let currentProject = projects.find((project) => project.isCurrent);
  if (!currentProject) {
    currentProject = projects[0];
  }

  useEffect(() => {
    if (isUserLoaded && _id && currentProject) {
      router.push(`/gantt/${currentProject._id}`);
    }
    if (isUserLoaded && !_id) {
      router.push(`/signup`);
    }
  }, [isUserLoaded, _id, currentProject]);

  return (
    <Head>
      {" "}
      <title> Daydreamer | Put your ideas on a timeline </title>{" "}
    </Head>
  );
}
