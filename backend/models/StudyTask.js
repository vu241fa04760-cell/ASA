const mongoose = require('mongoose');

const studyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    targetDate: {
      type: Date,
      required: [true, 'Please provide a target deadline date'],
    },
    estimatedMinutes: {
      type: Number,
      default: 45,
    },
    actualMinutesSpent: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudyTask', studyTaskSchema);
