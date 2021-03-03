const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const token = req.cookies.ganttToken;
    if (!token) {
      return res.json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.json({ message: "Unauthorized" });
    }

    const Task = getDB("Task");
    const tasks = await Task.find({ owner: user._id });
    return res.status(200).json({
      message: "ok",
      tasks,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
