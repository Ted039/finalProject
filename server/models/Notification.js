import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  startedProjectId: { type: Schema.Types.ObjectId, ref: 'Project' }, // assuming 'Project' is the model name
});

const Notification = model('Notification', notificationSchema);

export default Notification;
