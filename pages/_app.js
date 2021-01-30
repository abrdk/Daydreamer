import "../styles/globals.css";
import "../ganttChart/components/taskMenu/taskMenu.css";

import { UsersProvider } from "../ganttChart/context/users/UsersContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <Component {...pageProps} />;
    </UsersProvider>
  );
}
