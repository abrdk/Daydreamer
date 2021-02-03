import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

export default function Home() {
  return <></>;
}

export async function getServerSideProps(ctx) {
  let user;

  try {
    const token = cookie.parse(ctx.req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {
    ctx.res.setHeader(
      "Set-Cookie",
      cookie.serialize("ganttToken", "", {
        maxAge: 0,
        path: "/",
        sameSite: true,
        secure: true,
      })
    );
  }

  if (user) {
    return {
      redirect: {
        destination: "/gantt/new",
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: "/signup",
      permanent: false,
    },
  };
}
