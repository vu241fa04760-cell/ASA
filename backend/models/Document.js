const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'txt'],
      required: true,
    },
    subject: {
      type: String,
      default: 'General Study',
    },
    extractedText: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    keyTakeaways: [
      {
        type: String,
      },
    ],
    qaPairs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
