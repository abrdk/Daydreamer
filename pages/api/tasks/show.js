const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { project } = req.body;
    const Task = getDB("Task");
    const tasks = await Task.find({ project });
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
