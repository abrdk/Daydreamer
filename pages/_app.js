import "../styles/globals.css";
import "../ganttChart/components/taskMenu/taskMenu.css";

import { UsersProvider } from "../ganttChart/context/users/UsersContext";
import { ProjectsProvider } from "../ganttChart/context/projects/ProjectsContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <Component {...pageProps} />
      </ProjectsProvider>
    </UsersProvider>
  );
}
