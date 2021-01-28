const mongoose = require("mongoose");

try {
  mongoose.connect(
    "mongodb+srv://Admin:RhfcfdxbR3416@cluster0.id6e1.mongodb.net/daydreamer?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
} catch (e) {}

const getDB = (name) => {
  let DB;
  try {
    DB = mongoose.model(name);
  } catch (e) {
    DB = require("../models/" + name);
  }
  return DB;
};

module.exports = getDB;
