const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { token, id } = req.body;

  try {
    const user = jwt.verify(token, "jwtSecret");
    const Task = getDB("Task");

    Task.findOneAndDelete({ _id: id, owner: user.id }, (err, doc) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      return res.json({ message: "ok" });
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
