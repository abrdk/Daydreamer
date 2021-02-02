const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, default: "" },
  owner: { type: String, required: true },
  isCurrent: { type: Boolean, required: true },
});

module.exports = model("Project", schema);
