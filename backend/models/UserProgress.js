const mongoose = require('mongoose');

const weeklyActivitySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. Mon, Tue
  date: { type: String, required: true }, // YYYY-MM-DD
  minutes: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
});

const subjectProgressSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  minutesSpent: { type: Number, default: 0 },
  notesCount: { type: Number, default: 0 },
  quizzesCount: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0 },
});

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalStudyMinutes: {
      type: Number,
      default: 180, // initial sensible study progress
    },
    completedTopicsCount: {
      type: Number,
      default: 8,
    },
    quizzesTaken: {
      type: Number,
      default: 4,
    },
    averageQuizScore: {
      type: Number,
      default: 85,
    },
    streakDays: {
      type: Number,
      default: 5,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    subjectProgress: [subjectProgressSchema],
    weeklyActivity: [weeklyActivitySchema],
    recentActivities: [
      {
        activityType: {
          type: String,
          enum: ['quiz', 'note', 'task', 'chat', 'document'],
        },
        title: String,
        details: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserProgress', userProgressSchema);
