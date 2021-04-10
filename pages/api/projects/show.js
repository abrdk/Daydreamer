const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { _id } = req.body;

    const Project = getDB("Project");
    const project = await Project.findOne({ _id });
    if (project) {
      return res.status(200).json(project);
    }
    return res.status(200).json(false);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
