const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  color: { type: Date, required: true },
  owner: { type: String, required: true },
  project: { type: String, required: true },
  root: { type: String, default: true },
  order: { type: Number, required: true },
});

module.exports = model("Task", schema);
