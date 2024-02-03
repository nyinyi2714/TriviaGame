const { Schema, model } = require('mongoose')
const User = require('./User')

const leaderboardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = model('Leaderboard', leaderboardSchema)

