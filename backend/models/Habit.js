const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  emoji: String,
  time: String,
  date: String,
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Habit', HabitSchema);