const dbAdapter = require('../utils/dbAdapter');
const aiService = require('../services/aiService');

// @desc    Send message to AI Tutor
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { message, subject = 'General', sessionId, simplify = false } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message or question.',
      });
    }

    let session;
    if (sessionId) {
      session = await dbAdapter.chatHistories.findById(sessionId, req.user._id);
    }

    if (!session) {
      session = await dbAdapter.chatHistories.create({
        user: req.user._id,
        title: message.length > 40 ? `${message.slice(0, 37)}...` : message,
        subject,
        messages: [],
      });
    }

    const userMsg = {
      sender: 'user',
      content: message,
      subject,
      timestamp: new Date(),
    };
    session.messages.push(userMsg);

    const aiResponse = await aiService.generateChatResponse({
      message,
      subject,
      history: session.messages.slice(-6),
      simplify,
    });

    const assistantMsg = {
      sender: 'assistant',
      content: aiResponse.content,
      subject,
      conceptBreakdown: aiResponse.conceptBreakdown || [],
      examples: aiResponse.examples || [],
      youtube: aiResponse.youtube || null,
      timestamp: new Date(),
    };
    session.messages.push(assistantMsg);

    if (typeof session.save === 'function') {
      await session.save();
    }

    await dbAdapter.progress.update(req.user._id, {
      minutes: 5,
      activity: {
        activityType: 'chat',
        title: `Chatted with AI Tutor: ${subject}`,
        details: message.slice(0, 60),
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      sessionId: session._id,
      sessionTitle: session.title,
      reply: assistantMsg,
      aiProvider: aiResponse.source,
      practiceQuestion: aiResponse.practiceQuestion || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat sessions for user
// @route   GET /api/chat/sessions
// @access  Private
const getChatSessions = async (req, res, next) => {
  try {
    const sessions = await dbAdapter.chatHistories.findSessions(req.user._id);
    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session messages
// @route   GET /api/chat/sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await dbAdapter.chatHistories.findById(req.params.id, req.user._id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new chat session
// @route   POST /api/chat/sessions
// @access  Private
const createChatSession = async (req, res, next) => {
  try {
    const { title, subject = 'General' } = req.body;
    const session = await dbAdapter.chatHistories.create({
      user: req.user._id,
      title: title || `Study Session: ${subject}`,
      subject,
      messages: [],
    });

    return res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/sessions/:id
// @access  Private
const deleteChatSession = async (req, res, next) => {
  try {
    const session = await dbAdapter.chatHistories.delete(req.params.id, req.user._id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatSessions,
  getSessionById,
  createChatSession,
  deleteChatSession,
};
