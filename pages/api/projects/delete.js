import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.body;

  try {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    const user = jwt.verify(token, "jwtSecret");
    const Project = getDB("Project");

    Project.find({ owner: user.id }, (err, docs) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      if (docs.length > 1) {
        Project.findOneAndDelete({ _id: id, owner: user.id }, (err, doc) => {
          if (err)
            return res.status(500).json({ message: "Ошибка базы данных" });

          return res.json({ message: "ok" });
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
