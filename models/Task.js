const { Schema, model, Types } = require("mongoose");

function isNameRequired() {
  if (this.name == "") {
    return false;
  } else if (typeof this.name == "string") {
    return false;
  }
  return true;
}

function isDescriptionRequired() {
  if (this.description == "") {
    return false;
  } else if (typeof this.description == "string") {
    return false;
  }
  return true;
}

const schema = new Schema({
  name: { type: String, required: isNameRequired },
  description: { type: String, required: isDescriptionRequired },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  color: { type: Date, required: true },
  owner: { type: String, required: true },
  project: { type: String, required: true },
  root: { type: String, default: true },
  order: { type: Number, required: true },
});

module.exports = model("Task", schema);
