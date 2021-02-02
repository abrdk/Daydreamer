const { Schema, model, Types } = require("mongoose");

function isNameRequired() {
  if (this.name == "") {
    return false;
  } else if (typeof this.name == "string") {
    return false;
  }
  return true;
}

const schema = new Schema({
  name: { type: String, required: isNameRequired },
  owner: { type: String, required: true },
  isCurrent: { type: Boolean, required: true },
});

module.exports = model("Project", schema);
