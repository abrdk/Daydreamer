import { useState, useContext } from "react";
import styles from "../../../styles/tasks.module.css";
import { v4 as uuidv4 } from "uuid";

import { When } from "react-if";

import { TasksContext } from "../../context/tasks/TasksContext";

export default function TasksRoot({ root }) {
  const { tasks } = useContext(TasksContext);
  const tasksComponents = tasks
    .filter((task) => task.root == root)
    .sort((task1, task2) => task1.order > task2.order)
    .map((task, i) => {
      const subTasks = tasks.filter((subTask) => subTask.root == task._id);
      const [isSubtasksOpened, setSubtasksOpened] = useState(false);
      return (
        <>
          <div
            className={styles.task}
            onClick={() => setSubtasksOpened(!isSubtasksOpened)}
            key={uuidv4()}
          >
            <span
              className={task.name ? styles.fakeText : styles.fakeTextVisible}
              id={`fake-task-${i}`}
            >
              {task.name ? task.name : `Task name #${i + 1}`}
            </span>
            <When condition={subTasks.length}>
              <img
                className={
                  isSubtasksOpened ? styles.arrowDown : styles.arrowRight
                }
                src={
                  isSubtasksOpened
                    ? "/img/arrowDown.svg"
                    : "/img/arrowRightTask.svg"
                }
                alt=" "
              />
            </When>
            <div>{task.name}</div>
          </div>
          <When condition={isSubtasksOpened}>
            <div className={styles.subtasksWrapper}>
              <TasksRoot root={task._id} />
            </div>
          </When>
        </>
      );
    });

  return <div>{tasksComponents}</div>;
}
