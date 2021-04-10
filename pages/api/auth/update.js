import * as cookie from "cookie";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { name, password } = req.body;

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name) {
      return res.status(400).json({
        message: "User name should not be empty",
        errorType: "name",
      });
    }
    if (name.length > 35) {
      return res.status(400).json({
        message: "User name should be less than 35 charactes",
        errorType: "name",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password should not be empty",
        errorType: "password",
      });
    }
    if (password.length > 35) {
      return res.status(400).json({
        message: "Password length should be less than 35 characters",
        errorType: "password",
      });
    }

    const User = getDB("User");
    const candidate = await User.findOne({ name });

    if (candidate && candidate._id != user._id) {
      return res
        .status(400)
        .json({ message: "This name already exists", errorType: "name" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.findOneAndUpdate(
      { name: user.name },
      { $set: { name, password: hashedPassword } },
      {
        returnOriginal: false,
      }
    );

    const newToken = jwt.sign(
      { _id: result._id, name, password },
      "jwtSecret",
      {
        expiresIn: "24h",
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("ganttToken", newToken, {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
        sameSite: true,
      })
    );

    return res.status(201).json({
      message: "ok",
      user: { _id: user._id, name, password },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
