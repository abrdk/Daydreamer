import * as cookie from "cookie";
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.json({ _id: "", name: "", password: "" });
    }

    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ganttToken", "", {
          maxAge: 0,
          path: "/",
          sameSite: true,
        })
      );
      return res.status(401).json({ _id: "", name: "", password: "" });
    }

    return res
      .status(200)
      .json({ _id: user._id, name: user.name, password: user.password });
  } catch (e) {
    if (e.name == "TokenExpiredError") {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("ganttToken", "", {
          maxAge: 0,
          path: "/",
          sameSite: true,
        })
      );

      return res.status(401).json({
        message: "TokenExpiredError",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};
