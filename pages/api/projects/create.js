const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { name, token, isCurrent } = req.body;

  try {
    const user = jwt.verify(token, "jwtSecret");
    const Project = getDB("Project");

    const project = new Project({ name, owner: user.id, isCurrent });
    const p = await project.save();

    res.status(201).json({ message: "ok", project: p });
  } catch (e) {
    res.status(500).json({ message: "Ошибка базы данных" });
  }
};
