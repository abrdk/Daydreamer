const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { token, name, password } = req.body;
  let user;

  try {
    user = jwt.verify(token, "jwtSecret");
  } catch (e) {}

  if (user) {
    if (!name) {
      return res
        .status(400)
        .json({ message: "User name should not be empty", errorType: "name" });
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

    if (candidate) {
      return res
        .status(400)
        .json({ message: "This name already exists", errorType: "name" });
    }

    User.findOneAndUpdate(
      { name },
      { $set: { name, password } },
      function (err, result) {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        res.json({ message: "ok" });
      }
    );
  }
};
