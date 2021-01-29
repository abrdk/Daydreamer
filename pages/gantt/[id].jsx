import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "./Gantt.module.css";
import { xhr } from "../../helpers/xhr";
import GantChart from "../../ganttChart/ganttChart";
import { Modal } from "../../modal/modal";
import { ViewSwitcher } from "../../ganttChart/components/viewSwitcher/viewSwitcher";
import { ViewMode } from "../../ganttChart/types/public-types";

// name of project
let id = "new";

export default function Gantt({ charts: arr, currentChart, user }) {
  if (currentChart) currentChart = JSON.parse(currentChart).chart;

  const [charts, setCharts] = useState(arr ? JSON.parse(arr) : []);
  const [name, setName] = useState("");
  const [load, setLoad] = useState(currentChart ? currentChart : []);
  const [chart, setChart] = useState(currentChart ? currentChart : []);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(ViewMode.Day);

  const request = (query) => {
    setModal("loader");
    xhr("/gantt", { ...query }, "POST").then((res) => {
      if (res.message === "ok") {
        setModal(false);
        setCharts(res.charts);
      } else setModal(res.message);
    });
  };

  return (
    <>
      <Head>
        {" "}
        <title> Daydreamer | Put your ideas on a timeline </title>{" "}
      </Head>
      <Modal
        modal={modal}
        setModal={setModal}
        request={request}
        chart={chart}
        id={id}
        mapName={name}
        userName={user.name}
        password={user.password}
      />
      <div className={styles.container}>
        <div className={styles.mainMenuLeft}>
          {menu ? (
            <img
              src="/img/closeMenu.png"
              alt="close"
              onClick={() => setMenu(false)}
            />
          ) : (
            <img
              src="/img/openMenu.png"
              alt="close"
              onClick={() => setMenu(true)}
            />
          )}
        </div>
        <div
          className={styles.mainMenu}
          style={{ transform: menu ? "translateX(0)" : "translateX(-100%)" }}
        >
          <div className={styles.mainMenuHeader}>
            Проекты
            <img
              src="/img/add.png"
              alt="add"
              onClick={() => setModal("create")}
            />
          </div>
          {charts.map((k) => (
            <div
              key={k._id}
              className={styles.mainMenuRow}
              style={{ backgroundColor: k._id === id ? "#4D527F" : "" }}
            >
              <div>
                {k.name}
                <img
                  style={{ marginLeft: "8px" }}
                  src="/img/edit.png"
                  alt="edit"
                  onClick={() => {
                    setLoad(k.chart);
                    setName(k.name);
                    id = k._id;
                  }}
                />
              </div>
              <img
                src="/img/delete.png"
                alt="delete"
                onClick={() => {
                  setName(k.name);
                  id = k._id;
                  setModal("delete");
                }}
              />
            </div>
          ))}
          {user ? (
            <Link href="/logout">
              <a className={styles.logOut}>Выйти из аккаунта</a>
            </Link>
          ) : (
            <Link href="/signup">
              <a className={styles.logOut}>Регистрация</a>
            </Link>
          )}
        </div>
        <div className={styles.header}>
          <ViewSwitcher onViewModeChange={(viewMode) => setView(viewMode)} />
          <div />
          {name && (
            <div>
              Текущий проект - <b>{name}</b>
            </div>
          )}
          <div className={styles.buttonsContainer}>
            <button
              className={styles.share_button}
              onClick={setModal.bind(null, "share")}
            >
              Share Project
            </button>
            <button
              className={styles.account_button}
              onClick={setModal.bind(null, "account")}
            >
              <img src="/img/avatar.svg" alt=" " />{" "}
              <span>
                {user.name.length > 10
                  ? user.name.slice(0, 10) + "..."
                  : user.name}
              </span>
            </button>
            {/* <button
              onClick={request.bind(null, {
                query: "update",
                chart,
                id,
              })}
            >
              Записать
            </button> */}
          </div>
        </div>
        <div className={styles.gantChartWrap}>
          <div style={{ minWidth: "700px" }}>
            <GantChart
              chart={chart}
              setChart={setChart}
              load={load}
              view={view}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  let user, charts, currentChart;

  try {
    const token = cookie.parse(ctx.req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {}

  if (!user) {
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }

  try {
    const getDB = require("../../helpers/getDb");
    const Gantt = getDB("Gantt");
    if (user.id) charts = await Gantt.find({ user: user.id });
    currentChart = await Gantt.findOne({ _id: ctx.query.id });
  } catch (e) {}

  return {
    props: {
      charts: charts ? JSON.stringify(charts) : null,
      currentChart: currentChart ? JSON.stringify(currentChart) : null,
      user,
    },
  };
}
