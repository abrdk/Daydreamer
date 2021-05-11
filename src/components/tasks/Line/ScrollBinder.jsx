import { memo, useContext } from "react";
import useEvent from "@react-hook/event";
import useMouse from "@react-hook/mouse-position";
import useMedia from "use-media";

import { OptionsContext } from "@/src/context/OptionsContext";

const sidebarWidth = 335;

function ScrollBinder() {
  const isMobile = useMedia({ maxWidth: 576 });
  const { isMenuOpened } = useContext(OptionsContext);
  const mouse = useMouse(document.querySelector("#__next"), {
    enterDelay: 100,
    leaveDelay: 100,
  });

  useEvent(document.querySelector(".Tasks-Scroller"), "scroll", (e) => {
    if (!isMobile) {
      if (isMenuOpened && mouse.clientX <= sidebarWidth) {
        const lineScroller = document.querySelector(".LineTasks-Scroller");
        lineScroller.scrollTo(
          0,
          (e.target.scrollTop /
            (document.documentElement.clientHeight - e.target.scrollHeight)) *
            (document.documentElement.clientHeight - lineScroller.scrollHeight)
        );
      }
    } else if (isMenuOpened) {
      const lineScroller = document.querySelector(".LineTasks-Scroller");
      lineScroller.scrollTo(
        0,
        (e.target.scrollTop /
          (document.documentElement.clientHeight - e.target.scrollHeight)) *
          (document.documentElement.clientHeight - lineScroller.scrollHeight)
      );
    }
  });

  useEvent(document.querySelector(".LineTasks-Scroller"), "scroll", (e) => {
    if (!isMobile) {
      if ((isMenuOpened && mouse.clientX > sidebarWidth) || !isMenuOpened) {
        const tasksScroller = document.querySelector(".Tasks-Scroller");
        tasksScroller.scrollTo(
          0,
          (e.target.scrollTop /
            (document.documentElement.clientHeight - e.target.scrollHeight)) *
            (document.documentElement.clientHeight - tasksScroller.scrollHeight)
        );
      }
    } else if (!isMenuOpened) {
      const tasksScroller = document.querySelector(".Tasks-Scroller");
      tasksScroller.scrollTo(
        0,
        (e.target.scrollTop /
          (document.documentElement.clientHeight - e.target.scrollHeight)) *
          (document.documentElement.clientHeight - tasksScroller.scrollHeight)
      );
    }
  });

  return null;
}

export default memo(ScrollBinder);
