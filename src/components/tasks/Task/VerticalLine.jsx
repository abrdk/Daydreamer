import styles from "@/styles/tasks.module.scss";
import { When } from "react-if";

export default function VerticalLine({ task, editedTask }) {
  const isTaskEditing = () => editedTask == task._id;

  return (
    <When condition={isTaskEditing()}>
      <div className={styles.verticalLine} style={{ left: 0 }}></div>
    </When>
  );
}
