import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  avatar: {
    type: String,       // stores URL or filename
    default: '',        // blank by default
    trim: true,
  },
  badges: {
    type: [String],
    default: [],
  },
  endorsements: {
    type: [{ skill: String, from: String }],
    default: [],
  },
  swapHistory: {
    type: [
      {
        partner: String,          // other user
        skillOffered: String,
        skillReceived: String,
        status: String,           // 'completed', 'rejected', 'pending'
        date: Date
      }
    ],
    default: [],
  },


}, { timestamps: true });

export default mongoose.model('User', userSchema);
