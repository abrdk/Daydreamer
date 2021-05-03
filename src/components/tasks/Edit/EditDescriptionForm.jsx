import { useContext, useState, useEffect, useRef, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import Scrollbar from "react-scrollbars-custom";
import usePrevious from "@react-hook/previous";
import useMedia from "use-media";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerEditDescription({ task, isUserOwnsProject, updateTask }) {
  const isMobile = useMedia({ maxWidth: 576 });
  const fakeText = useRef(null);
  const textArea = useRef(null);

  const [editedDescription, setEditedDescription] = useState(() =>
    task ? task.description : ""
  );
  const prevDescription = usePrevious(editedDescription);
  const [isTextareaFocused, setTextareaFocused] = useState(false);

  const handleDescriptionUpdate = (e) => {
    setEditedDescription(e.target.value);
    updateTask({ ...task, description: e.target.value });
  };

  const handleBlur = (e) => {
    setTextareaFocused(false);
  };

  const handleFocus = (e) => {
    if (!isUserOwnsProject) {
      e.target.blur();
    } else {
      setTextareaFocused(true);
    }
  };

  const updateTextareaHeight = () => {
    if (fakeText.current && textArea.current) {
      textArea.current.style.height = fakeText.current.clientHeight + "px";
    }
  };

  const synchronizeTaskDescription = () => {
    if (task) {
      setEditedDescription(task.description);
    }
  };

  useEffect(() => {
    synchronizeTaskDescription();
  }, [task]);

  useEffect(() => {
    updateTextareaHeight();
  }, [editedDescription]);

  return (
    <>
      <div ref={fakeText} className={styles.fakeText}>
        {editedDescription}
      </div>
      <label
        className={
          editedDescription || isTextareaFocused
            ? styles.descriptionFilled
            : styles.description
        }
        htmlFor="taskDescription"
      >
        <div className={styles.teaxtareaWrapper}>
          <Scrollbar
            style={{ height: isMobile ? 41 : 238 }}
            noScrollY={isMobile ? true : false}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className="ScrollbarsCustom-Track ScrollbarsCustom-TrackY ScrollbarsCustom-EditTask"
                  />
                );
              },
            }}
          >
            <textarea
              ref={textArea}
              spellCheck="false"
              id="taskDescription"
              name="description"
              value={editedDescription}
              onChange={handleDescriptionUpdate}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </Scrollbar>
        </div>
        <span
          style={{
            transition:
              (!prevDescription && editedDescription) ||
              (prevDescription && !editedDescription)
                ? "all 0ms"
                : "all 200ms",
          }}
        >
          Enter task description
        </span>
      </label>
    </>
  );
}

InnerEditDescription = memo(InnerEditDescription, (prevProps, nextProps) => {
  for (let key in prevProps.task) {
    if (prevProps.task[key] != nextProps.task[key]) {
      return false;
    }
  }
  return prevProps.isUserOwnsProject == nextProps.isUserOwnsProject;
});

export default function EditDescription({ task }) {
  const { isUserOwnsProject } = useContext(ProjectsContext);
  const { updateTask } = useContext(TasksContext);

  return <InnerEditDescription {...{ task, isUserOwnsProject, updateTask }} />;
}
