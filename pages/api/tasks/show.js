const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { token } = req.body;

  try {
    const user = jwt.verify(token, "jwtSecret");
    const Task = getDB("Task");

    Task.find({ owner: user.id }, (err, docs) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      return res.status(201).json({
        message: "ok",
        tasks: docs,
      });
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
