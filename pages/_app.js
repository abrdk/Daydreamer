import "@/styles/globals.scss";

import { UsersProvider } from "@/src/context/UsersContext";
import { ProjectsProvider } from "@/src/context/ProjectsContext";
import { TasksProvider } from "@/src/context/TasksContext";

import RedirectManager from "@/src/components/redirect/RedirectManager";

export default function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <TasksProvider>
          <RedirectManager>
            <Component {...pageProps} />
          </RedirectManager>
        </TasksProvider>
      </ProjectsProvider>
    </UsersProvider>
  );
}
