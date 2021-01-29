const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { name, password, query } = req.body;

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
    return res
      .status(400)
      .json({ message: "Password should not be empty", errorType: "password" });
  }
  if (password.length > 35) {
    return res.status(400).json({
      message: "Password length should be less than 35 characters",
      errorType: "password",
    });
  }

  try {
    const User = getDB("User");
    const candidate = await User.findOne({ name });

    if (query === "signup") {
      if (candidate) {
        return res
          .status(400)
          .json({ message: "This name already exists", errorType: "name" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, password: hashedPassword });
      const u = await user.save();
      const token = jwt.sign({ id: u.id, name, password }, "jwtSecret", {
        expiresIn: "24h",
      });
      res.setHeader(
        "Set-Cookie",
        `ganttToken=${token}; max-age=36000000; Path=/`
      );
      res.status(201).json({ message: "ok" });
    } else if (query === "login") {
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
        { id: candidate.id, name: name, password },
        "jwtSecret",
        {
          expiresIn: "24h",
        }
      );
      res.setHeader(
        "Set-Cookie",
        `ganttToken=${token}; max-age=36000000; Path=/`
      );
      res.json({ message: "ok" });
    }
  } catch (e) {
    res.status(500).json({ message: "Ошибка базы данных" });
  }
};
