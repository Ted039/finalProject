
const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: String,
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill: String,
  swapId: String,
  startedAt: Date,
  status: String,
  updates: [
    {
      message: String,
      timestamp: Date
    }
  ]
})

module.exports = mongoose.model('Project', projectSchema)
