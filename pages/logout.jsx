import { useEffect } from "react";
import Router from "next/router";

export default function Logout(props) {
  useEffect(() => Router.push("/"), [props]);
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
