import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { name, isCurrent } = req.body;

  try {
    const token = cookie.parse(req.headers.cookie).ganttToken;
    const user = jwt.verify(token, "jwtSecret");
    const Project = getDB("Project");

    const project = new Project({ name, owner: user.id, isCurrent });
    const p = await project.save();

    return res.status(201).json({ message: "ok", project: p });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
