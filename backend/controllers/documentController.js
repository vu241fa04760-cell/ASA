const dbAdapter = require('../utils/dbAdapter');
const aiService = require('../services/aiService');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// @desc    Upload document, extract text, summarize with AI
// @route   POST /api/documents/upload
// @access  Private
const uploadAndSummarizeDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF or TXT file.',
      });
    }

    const { subject = 'General Study' } = req.body;
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const originalName = req.file.originalname;

    let extractedText = '';

    if (fileExt === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = (pdfData && pdfData.text) ? pdfData.text.trim() : '';
    } else {
      extractedText = fs.readFileSync(filePath, 'utf-8').trim();
    }

    if (!extractedText || extractedText.length < 15) {
      extractedText = `Document: ${originalName}. Contains instructional and study reference notes for ${subject}.`;
    }

    const summaryResult = await aiService.summarizeDocument({
      text: extractedText,
      originalName,
      subject,
    });

    const newDoc = await dbAdapter.documents.create({
      user: req.user._id,
      originalName,
      fileName: req.file.filename,
      filePath,
      fileSize: req.file.size,
      fileType: fileExt === 'pdf' ? 'pdf' : 'txt',
      subject,
      extractedText: extractedText.slice(0, 30000),
      summary: summaryResult.summary,
      keyTakeaways: summaryResult.keyTakeaways || [],
      qaPairs: summaryResult.qaPairs || [],
    });

    await dbAdapter.progress.update(req.user._id, {
      minutes: 25,
      activity: {
        activityType: 'document',
        title: `Summarized Document: ${originalName}`,
        details: `Extracted ${extractedText.split(/\s+/).length} words`,
        timestamp: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Document analyzed and summarized successfully!',
      document: newDoc,
      aiProvider: summaryResult.source,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ask questions on an uploaded document
// @route   POST /api/documents/:id/ask
// @access  Private
const askDocumentQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question to ask about this document.',
      });
    }

    const document = await dbAdapter.documents.findById(req.params.id, req.user._id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const answerResult = await aiService.askDocumentQuestion({
      documentText: document.extractedText,
      question,
      originalName: document.originalName,
    });

    return res.status(200).json({
      success: true,
      answer: answerResult.answer,
      aiProvider: answerResult.source,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
const getUserDocuments = async (req, res, next) => {
  try {
    const documents = await dbAdapter.documents.find(req.user._id);
    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res, next) => {
  try {
    const document = await dbAdapter.documents.findById(req.params.id, req.user._id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    return res.status(200).json({ success: true, document });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await dbAdapter.documents.delete(req.params.id, req.user._id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndSummarizeDocument,
  askDocumentQuestion,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
};
