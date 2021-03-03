const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { project } = req.body;
  try {
    const Task = getDB("Task");
    const tasks = await Task.find({ project });
    return res.status(200).json({
      message: "ok",
      tasks,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
