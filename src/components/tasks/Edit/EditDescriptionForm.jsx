import { useContext, useState, useEffect, useRef, memo } from "react";
import styles from "@/styles/taskEdit.module.scss";
import Scrollbar from "react-scrollbars-custom";
import usePrevious from "@react-hook/previous";
import useMedia from "use-media";
import TextareaAutosize from "react-textarea-autosize";

import { TasksContext } from "@/src/context/TasksContext";
import { ProjectsContext } from "@/src/context/ProjectsContext";

function InnerEditDescription({ task, isUserOwnsProject, updateTask }) {
  const isMobile = useMedia({ maxWidth: 576 });
  const textArea = useRef(null);
  const hiddenTextareaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState(40);

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
    e.target.selectionStart = 0;
    e.target.selectionEnd = 0;
    setTextareaFocused(false);
    if (isMobile) {
      document.querySelector(".Description-Scroller").scrollTop = 0;
    }
  };

  const handleFocus = (e) => {
    if (!isUserOwnsProject) {
      e.target.blur();
    } else {
      setTextareaFocused(true);
    }
  };

  const synchronizeTaskDescription = () => {
    if (task) {
      hiddenTextareaRef.current.value = task.description;
      setEditedDescription(task.description);
    }
  };

  useEffect(() => {
    synchronizeTaskDescription();
  }, [task]);

  return (
    <>
      <label
        className={
          editedDescription || isTextareaFocused
            ? isTextareaFocused
              ? `${styles.descriptionFilled} ${styles.opened}`
              : styles.descriptionFilled
            : isTextareaFocused
            ? `${styles.description} ${styles.opened}`
            : styles.description
        }
        htmlFor="taskDescription"
      >
        <div className={styles.teaxtareaWrapper}>
          <Scrollbar
            style={{ height: isMobile ? "100%" : 238 }}
            noScrollY={isMobile && !isTextareaFocused}
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
            scrollerProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className="ScrollbarsCustom-Scroller Description-Scroller"
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
              style={{ height: textAreaHeight }}
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

      <div className={styles.textAreaAutosize}>
        <TextareaAutosize
          onHeightChange={(height) => setTextAreaHeight(height)}
          ref={(tag) => (hiddenTextareaRef.current = tag)}
        />
      </div>
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
