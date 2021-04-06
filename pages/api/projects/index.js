const jwt = require("jsonwebtoken");
const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const token = req.cookies.ganttToken;
    if (!token) {
      return res.json(false);
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.json(false);
    }

    const Project = getDB("Project");
    const projects = await Project.find({ owner: user._id });
    return res.status(200).json(projects);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
