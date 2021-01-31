import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

export default function Home() {
  return <></>;
}

export async function getServerSideProps({ res, req }) {
  let user;

  if (req.headers.cookie) {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
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
