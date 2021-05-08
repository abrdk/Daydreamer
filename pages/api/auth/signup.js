import * as cookie from "cookie";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { _id, name, password } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "User name should not be empty", errorType: "name" });
    }
    if (name.length > 35) {
      return res.status(400).json({
        message: "User name should be less than 35 characters",
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

    if (candidate) {
      return res
        .status(400)
        .json({ message: "This name already exists", errorType: "name" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ _id, name, password: hashedPassword });
    const u = await user.save();
    const token = jwt.sign({ _id: u._id, name, password }, "jwtSecret", {
      expiresIn: "365 days",
    });
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("ganttToken", token, {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
        sameSite: true,
      })
    );
    res.status(201).json({ message: "ok", user: { _id, name, password } });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
