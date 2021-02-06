const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { _id } = req.body;

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
    Project.find({ owner: user._id }, (err, docs) => {
      if (err) return res.status(500).json({ message: "Ошибка базы данных" });

      if (docs.length > 1) {
        Project.findOneAndDelete({ _id, owner: user._id }, (err, doc) => {
          if (err)
            return res.status(500).json({ message: "Ошибка базы данных" });

          return res.json({ message: "ok" });
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
