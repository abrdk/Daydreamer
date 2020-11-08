const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true},
  user: {type: String, required: true},
  chart: {type: [], required: true},
  date: {type: Date, default: Date.now}
})

module.exports = model('Gantt', schema);