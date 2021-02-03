import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    name,
    description,
    dateStart,
    dateEnd,
    color,
    project,
    root,
    order,
  } = req.body;

  try {
    const dateStartM = new Date(dateStart);
    const dateEndM = new Date(dateEnd);
    if (dateEndM - dateStartM < 0) {
      return res.status(400).json({
        message:
          "The end of the task cannot be earlier than the start of the task ",
      });
    }

    const token = cookie.parse(req.headers.cookie).ganttToken;

    const user = jwt.verify(token, "jwtSecret");
    const Project = getDB("Project");

    Project.findOne({ owner: user.id, _id: project }, async (err, doc) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      if (!doc) {
        return res.status(400).json({
          message: "The user does not own this project",
        });
      }

      const Task = getDB("Task");
      const task = new Task({
        name,
        description,
        dateStart,
        dateEnd,
        color,
        owner: user.id,
        project,
        root,
        order,
      });
      const t = await task.save();
      return res.status(201).json({ message: "ok", task: t });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
