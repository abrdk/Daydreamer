import * as cookie from "cookie";
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    id,
    name,
    description,
    dateStart,
    dateEnd,
    color,
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

    if (color.length !== 6) {
      return res.status(400).json({
        message: "Color must be a strig of 6 characters",
      });
    }

    const token = cookie.parse(req.headers.cookie).ganttToken;
    const user = jwt.verify(token, "jwtSecret");
    const Task = getDB("Task");

    Task.findOneAndUpdate(
      { _id: id, owner: user.id },
      { $set: { name, description, dateStart, dateEnd, color, root, order } },
      {
        returnOriginal: false,
      },
      function (err, result) {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        return res.status(201).json({
          message: "ok",
          task: result,
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
