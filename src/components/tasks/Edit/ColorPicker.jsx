import { useContext, useState, useEffect } from "react";
import styles from "@/styles/taskEdit.module.scss";

import { TasksContext } from "@/src/context/TasksContext";

export default function ColorPicker({ task }) {
  const { updateTask } = useContext(TasksContext);

  const [editedColor, setEditedColor] = useState("");

  const updateColor = (color) => {
    setEditedColor(color);
    updateTask({ ...task, color });
  };

  useEffect(() => {
    if (task) {
      setEditedColor(task.color);
    }
  }, [task]);

  const colorsElements = [
    "258EFA",
    "FFBC42",
    "59CD90",
    "D06BF3",
    "66CEDC",
    "FF5B79",
  ].map((color) => (
    <div
      key={color}
      className={styles.color}
      style={{
        background: editedColor == color && `#fff`,
        border: editedColor == color && `1px solid #${color}`,
      }}
      onClick={() => updateColor(color)}
    >
      <div className={styles.colorInner}></div>
    </div>
  ));

  return <div className={styles.colorsWrapper}>{colorsElements}</div>;
}
