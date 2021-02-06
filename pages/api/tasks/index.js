const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Task = getDB("Task");
    Task.find({ owner: user.id }, (err, docs) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      return res.status(200).json({
        message: "ok",
        tasks: docs,
      });
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных", e });
  }
};
