import { useContext } from "react";
import styles from "@/styles/taskEdit.module.scss";
import authStyles from "@/styles/auth.module.scss";
import FloatingLabel from "floating-label-react";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksEdit({ task }) {
  if (task) {
    const { updateTask } = useContext(TasksContext);
    return (
      <></>
      // <div className={styles.wrapper}>
      //   <FloatingLabel
      //     id="name"
      //     name="name"
      //     placeholder="Enter task name"
      //     className={
      //       task.name ? authStyles.formInputFilled : authStyles.formInput
      //     }
      //     value={task.name}
      //     // onChange={(e) => setName(e.target.value)}
      //   />
      // </div>
    );
  } else {
    return <></>;
  }
}
