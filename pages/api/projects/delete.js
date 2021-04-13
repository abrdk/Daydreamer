const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { _id } = req.body;

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Project = getDB("Project");
    const projects = await Project.find({ owner: user._id });
    if (projects.length > 1) {
      await Project.findOneAndDelete({ _id, owner: user._id });
      return res.json({ message: "ok" });
    }
    return res
      .status(400)
      .json({ message: "You cannot delete the last project " });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
