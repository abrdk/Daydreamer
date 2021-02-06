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

function isRootRequired() {
  if (this.root == "") {
    return false;
  } else if (typeof this.root == "string") {
    return false;
  }
  return true;
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
