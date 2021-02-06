import "../styles/globals.css";

import { UsersProvider } from "../ganttChart/context/users/UsersContext";
import { ProjectsProvider } from "../ganttChart/context/projects/ProjectsContext";
import { TasksProvider } from "../ganttChart/context/tasks/TasksContext";

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
