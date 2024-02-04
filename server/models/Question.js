const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  difficulty: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: true,
  },
});

module.exports = model('Question', questionSchema);
