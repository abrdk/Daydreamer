import "@/styles/globals.scss";

import { UsersProvider } from "@/src/context/users/UsersContext";
import { ProjectsProvider } from "@/src/context/projects/ProjectsContext";
import { TasksProvider } from "@/src/context/tasks/TasksContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <TasksProvider>
          <Component {...pageProps} />
        </TasksProvider>
      </ProjectsProvider>
    </UsersProvider>
  );
}
