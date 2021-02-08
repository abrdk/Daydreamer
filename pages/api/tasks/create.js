const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  console.log("req.body");
  res.setHeader("Content-Type", "application/json");
  const {
    _id,
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

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Project = getDB("Project");
    Project.findOne({ owner: user._id, _id: project }, async (err, doc) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      if (!doc) {
        return res.status(400).json({
          message: "The user does not own this project",
        });
      }

      const Task = getDB("Task");
      const task = new Task({
        _id,
        name,
        description,
        dateStart,
        dateEnd,
        color,
        owner: user._id,
        project,
        root,
        order,
      });
      const t = await task.save();
      return res.status(201).json({ message: "ok", task: t });
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
