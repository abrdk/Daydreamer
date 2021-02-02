const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDB = require("../../../helpers/getDb.js");

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { token } = req.body;
  let user;

  try {
    user = jwt.verify(token, "jwtSecret");

    if (user) {
      const User = getDB("User");
      User.findOneAndDelete({ name: user.name }, (err, doc) => {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        res.setHeader("Set-Cookie", `ganttToken=''; max-age=0; Path=/`);
        return res.json({ message: "ok" });
      });
    }
  } catch (e) {
    return res.status(500).json({ message: "Ошибка базы данных" });
  }
};
