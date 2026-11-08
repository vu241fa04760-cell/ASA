const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Please provide a topic name'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Please provide summary content'],
    },
    keyPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    detailedExplanation: {
      type: String,
      default: '',
    },
    practicalExamples: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'blue', // 'blue', 'purple', 'emerald', 'amber', 'rose'
    },
    youtube: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
