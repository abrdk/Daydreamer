const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const {
    _id,
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

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Task = getDB("Task");
    const result = await Task.findOneAndUpdate(
      { _id, owner: user._id },
      { $set: { name, description, dateStart, dateEnd, color, root, order } },
      {
        returnOriginal: false,
      }
    );
    return res.status(201).json({
      message: "ok",
      task: result,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
