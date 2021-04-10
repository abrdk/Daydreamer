import * as cookie from "cookie";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { name, password } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "User name should not be empty", errorType: "name" });
    }

    if (!password) {
      return res
        .status(400)
        .json({
          message: "Password should not be empty",
          errorType: "password",
        });
    }

    const User = getDB("User");
    const candidate = await User.findOne({ name });

    if (!candidate) {
      return res
        .status(400)
        .json({ message: "User name doesn’t exist", errorType: "name" });
    }
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "User name and password do not match",
        errorType: "password",
      });
    }
    const token = jwt.sign(
      { _id: candidate._id, name, password },
      "jwtSecret",
      {
        expiresIn: "24h",
      }
    );
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("ganttToken", token, {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
        sameSite: true,
      })
    );
    return res.json({
      message: "ok",
      user: { _id: candidate._id, name, password },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
