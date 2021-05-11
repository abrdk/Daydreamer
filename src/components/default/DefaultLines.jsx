import lineStyles from "@/styles/default.module.scss";
import useMedia from "use-media";
import { useWindowSize } from "@react-hook/window-size";
import { When } from "react-if";

export default function DefaultLines() {
  const isMobile = useMedia({ maxWidth: 576 });
  const [windowWidth, windowHeight] = useWindowSize();
  return (
    <div
      style={{
        display: isMobile ? "none" : "block",
      }}
    >
      <When condition={182 + 35 + 20 < windowHeight && 262 + 282 < windowWidth}>
        <div
          className={lineStyles.lineTask}
          style={{
            left: 262,
            top: 182,
            background: `#FFBC42`,
            width: 282,
          }}
        >
          <div className={lineStyles.stick}></div>
          Task name #1
          <div className={lineStyles.stick}></div>
        </div>
      </When>
      <When
        condition={
          182 + (35 + 20) * 2 < windowHeight && 442 + 330 < windowWidth
        }
      >
        <div
          className={lineStyles.lineTask}
          style={{ left: 442, top: 182 + 35 + 20, background: `#258EFA` }}
        >
          <div className={lineStyles.stick}></div>
          Task name #2
          <div className={lineStyles.stick}></div>
        </div>
      </When>
      <When
        condition={
          182 + (35 + 20) * 3 < windowHeight && 363 + 141 < windowWidth
        }
      >
        <div
          className={lineStyles.lineTask}
          style={{
            left: 362,
            top: 182 + (35 + 20) * 2,
            width: 141,
            background: `#FFBC42`,
          }}
        >
          <div className={lineStyles.stick}></div>
          Task name #3
          <div className={lineStyles.stick}></div>
        </div>
      </When>
      <When
        condition={
          182 + (35 + 20) * 5 < windowHeight && 985 + 330 < windowWidth
        }
      >
        <div
          className={lineStyles.lineTask}
          style={{ left: 985, top: 182 + (35 + 20) * 4, background: `#FFBC42` }}
        >
          <div className={lineStyles.stick}></div>
          Task name #4
          <div className={lineStyles.stick}></div>
        </div>
      </When>
      <When
        condition={
          182 + (35 + 20) * 6 < windowHeight && 500 + 369 < windowWidth
        }
      >
        <div
          className={lineStyles.lineTask}
          style={{
            left: 500,
            top: 182 + (35 + 20) * 5,
            width: 369,
            background: `#59CD90`,
          }}
        >
          <div className={lineStyles.stick}></div>
          Task name #5
          <div className={lineStyles.stick}></div>
        </div>
      </When>
    </div>
  );
}
