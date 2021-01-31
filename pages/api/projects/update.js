const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { token, id, name, isCurrent } = req.body;

  try {
    const user = jwt.verify(token, "jwtSecret");
    const Project = getDB("Project");

    Project.findOneAndUpdate(
      { _id: id, owner: user.owner },
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
    res.status(500).json({ message: "Ошибка базы данных" });
  }
};
