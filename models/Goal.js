// models/Goal.js
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    timeframe: {
      type: String,
      enum: ['12-weeks'],
      default: '12-weeks',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
