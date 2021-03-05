import lineStyles from "@/styles/default.module.scss";

export default function DefaultLines() {
  return (
    <>
      <div
        className={lineStyles.lineTask}
        style={{ left: 214 + 48, top: 182, background: `#FFBC42`, width: 282 }}
      >
        <div className={lineStyles.stick}></div>
        Task name #1
        <div className={lineStyles.stick}></div>
      </div>
      <div
        className={lineStyles.lineTask}
        style={{ left: 442, top: 182 + 35 + 20, background: `#258EFA` }}
      >
        <div className={lineStyles.stick}></div>
        Task name #2
        <div className={lineStyles.stick}></div>
      </div>
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
      <div
        className={lineStyles.lineTask}
        style={{ left: 985, top: 182 + (35 + 20) * 4, background: `#FFBC42` }}
      >
        <div className={lineStyles.stick}></div>
        Task name #4
        <div className={lineStyles.stick}></div>
      </div>
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
    </>
  );
}
