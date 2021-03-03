const getDB = require("@/helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { _id } = req.body;

  try {
    const Project = getDB("Project");
    const project = await Project.findOne({ _id });
    return res.status(200).json({
      message: "ok",
      project,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
