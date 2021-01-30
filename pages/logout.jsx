import { useEffect, useContext } from "react";
import Router from "next/router";

import { UsersContext } from "../ganttChart/context/users/UsersContext";

export default function Logout(props) {
  const { setUser } = useContext(UsersContext);

  useEffect(() => {
    setUser({ id: "", token: "", name: "", password: "" });
    Router.push("/");
  }, [props]);

  return null;
}

export async function getServerSideProps(ctx) {
  if (ctx.req) {
    ctx.res.setHeader("Set-Cookie", `ganttToken=''; max-age=0; Path=/`);
    ctx.res.writeHead(302, { Location: "/signup" });
    ctx.res.end();
  }
  return {
    props: {},
  };
}
