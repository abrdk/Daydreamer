import "@/styles/globals.scss";

import { UsersProvider } from "@/src/context/UsersContext";
import { ProjectsProvider } from "@/src/context/ProjectsContext";
import { TasksProvider } from "@/src/context/TasksContext";
import { OptionsProvider } from "@/src/context/OptionsContext";

import RedirectManager from "@/src/components/redirect/RedirectManager";

export default function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <TasksProvider>
          <OptionsProvider>
            <RedirectManager>
              <Component {...pageProps} />
            </RedirectManager>
          </OptionsProvider>
        </TasksProvider>
      </ProjectsProvider>
    </UsersProvider>
  );
}
