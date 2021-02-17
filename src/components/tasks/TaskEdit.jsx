import { useContext } from "react";
import styles from "@/styles/taskEdit.module.scss";
import authStyles from "@/styles/auth.module.scss";
import FloatingLabel from "floating-label-react";

import { TasksContext } from "@/src/context/tasks/TasksContext";
import { ProjectsContext } from "@/src/context/projects/ProjectsContext";

export default function TasksEdit() {
  const { tasks } = useContext(TasksContext);
  const task = tasks.find((t) => t._id == "IX-gCJ_0Go5hztWjK2c73");
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
}
