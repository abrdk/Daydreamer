const { Schema, model, Types } = require("mongoose");

function isNameRequired() {
  return typeof this.name === "string" ? false : true;
}

const schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: isNameRequired },
  owner: { type: String, required: true },
  isCurrent: { type: Boolean, required: true },
});

module.exports = model("Project", schema);
