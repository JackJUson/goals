// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: false, // Make this field optional
    },
    weekNumber: {
      type: Number,
      required: false, // Make this field optional
    },
    name: {
      type: String,
      required: false, // Make this field optional
      default: 'Unnamed Task', // Provide a default value
    },
    frequency: {
      type: String,
      enum: ['daily', '6', '5', '4', '3', '2', '1'],
      default: 'daily',
    },
    dueDate: {
      type: Date,
      required: false, // Make this field optional
    },
    days: {
      Mon: { type: Boolean, default: false },
      Tue: { type: Boolean, default: false },
      Wed: { type: Boolean, default: false },
      Thu: { type: Boolean, default: false },
      Fri: { type: Boolean, default: false },
      Sat: { type: Boolean, default: false },
      Sun: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
