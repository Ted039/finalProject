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
}, { timestamps: true });

export default mongoose.model('User', userSchema);
