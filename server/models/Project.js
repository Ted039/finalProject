import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Reuse existing subschemas from SkillSwapCollab
const messageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const noteSchema = new Schema({
  content: { type: String, required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

const resourceSchema = new Schema({
  title: String,
  type: String,
  url: String,
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

const projectSchema = new Schema({
  collabTitle: { type: String, required: true },
  initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillsOffered: [{ type: String }],
  skillsRequested: [{ type: String }],
  swapId: { type: Schema.Types.ObjectId, ref: 'SkillSwapCollab' },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  goals: [String],
  messages: [messageSchema],
  notes: [noteSchema],
  resourcesShared: [resourceSchema],
}, { timestamps: true });

export default model('Project', projectSchema);
