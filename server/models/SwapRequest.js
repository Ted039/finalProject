import mongoose from 'mongoose'

const swapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true },
  requestedSkill: { type: String, required: true },
  message: { type: String }, 
  date: { type: Date, required: function () {
    return this.isNew //  only required when creating a new request
  }}, 
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending',
  },
}, { timestamps: true })

export default mongoose.model('SwapRequest', swapRequestSchema)
