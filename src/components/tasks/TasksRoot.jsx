import { useContext, useState } from "react";
import { When } from "react-if";
import styles from "@/styles/tasks.module.scss";

import Task from "@/src/components/tasks/Task";

import { TasksContext } from "@/src/context/tasks/TasksContext";

export default function TasksRoot({ root }) {
  const { tasks } = useContext(TasksContext);
  const filteredTasks = tasks.filter((task) => task.root == root);

  const [isSubtasksOpened, setSubtasksState] = useState(
    filteredTasks.map(() => false)
  );

  const tasksComponents = filteredTasks
    .sort((task1, task2) => task1.order > task2.order)
    .map((task, i) => {
      const subTasks = tasks.filter((subTask) => subTask.root == task._id);
      return (
        <div key={task._id}>
          <Task
            task={task}
            hasSubtasks={subTasks.length ? true : false}
            isSubtasksOpened={isSubtasksOpened}
            setSubtasksState={setSubtasksState}
          />
          <When condition={subTasks.length && isSubtasksOpened[i]}>
            <div className={styles.subtasksWrapper}>
              <TasksRoot root={task._id} />
            </div>
          </When>
        </div>
      );
    });

  return <>{tasksComponents}</>;
}
