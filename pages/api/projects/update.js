const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { _id, name, isCurrent } = req.body;

  try {
    const token = req.cookies.ganttToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = jwt.verify(token, "jwtSecret");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Project = getDB("Project");
    Project.findOneAndUpdate(
      { _id, owner: user._id },
      { $set: { name, isCurrent } },
      {
        returnOriginal: false,
      },
      function (err, result) {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        return res.status(201).json({
          message: "ok",
          project: result,
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
