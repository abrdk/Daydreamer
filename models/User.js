const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = model("User", schema);
