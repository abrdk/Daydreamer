import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

export default function Home() {
  return <></>;
}

Home.getInitialProps = async ({ res }) => {
  let user;

  try {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {}

  if (user) {
    res.writeHead(302, { Location: "gantt/new" });
    res.end();
  } else {
    res.writeHead(302, { Location: "signup" });
    res.end();
  }
};
