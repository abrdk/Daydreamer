const { Schema, model, Types } = require("mongoose");

function isNameRequired() {
  return typeof this.name === "string" ? false : true;
}

function isDescriptionRequired() {
  return typeof this.description === "string" ? false : true;
}

function isRootRequired() {
  return typeof this.root === "string" ? false : true;
}

const schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: isNameRequired },
  description: { type: String, required: isDescriptionRequired },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  color: { type: String, required: true },
  owner: { type: String, required: true },
  project: { type: String, required: true },
  root: { type: String, required: isRootRequired },
  order: { type: Number, required: true },
});

module.exports = model("Task", schema);
