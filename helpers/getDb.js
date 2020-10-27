const mongoose = require('mongoose');

try {
  mongoose.connect('mongodb://localhost:27017/gantt',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
} catch(e) {}

const getDB = name => {
  let DB;
  try {
    DB = mongoose.model(name)
  } catch (e) { DB = require('../models/'+name); }
  return DB;
}

module.exports = getDB;