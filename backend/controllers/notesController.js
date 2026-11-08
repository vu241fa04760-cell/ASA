const dbAdapter = require('../utils/dbAdapter');
const aiService = require('../services/aiService');

// @desc    Generate AI Study Notes
// @route   POST /api/notes/generate
// @access  Private
const generateNotes = async (req, res, next) => {
  try {
    const { topic, subject, difficulty, saveDirectly = false } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both topic and subject to generate notes.',
      });
    }

    const aiData = await aiService.generateNotes({ topic, subject, difficulty });

    let savedNote = null;
    if (saveDirectly) {
      savedNote = await dbAdapter.notes.create({
        user: req.user._id,
        title: aiData.title || `Mastery Notes: ${topic}`,
        subject,
        topic,
        summary: aiData.summary,
        keyPoints: aiData.keyPoints || [],
        detailedExplanation: aiData.detailedExplanation || '',
        practicalExamples: aiData.practicalExamples || [],
        tags: aiData.tags || [subject.toLowerCase(), 'exam-prep'],
        youtube: aiData.youtube || null,
      });

      await dbAdapter.progress.update(req.user._id, {
        minutes: 20,
        activity: {
          activityType: 'note',
          title: `Created Notes: ${topic}`,
          details: `Subject: ${subject} (${difficulty || 'Intermediate'})`,
          timestamp: new Date(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: savedNote || aiData,
      isSaved: Boolean(savedNote),
      aiProvider: aiData.source,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Save Note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, subject, topic, summary, keyPoints, detailedExplanation, practicalExamples, tags, isPinned, color } = req.body;

    if (!title || !subject || !topic || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in title, subject, topic, and summary.',
      });
    }

    const note = await dbAdapter.notes.create({
      user: req.user._id,
      title,
      subject,
      topic,
      summary,
      keyPoints: Array.isArray(keyPoints) ? keyPoints : (keyPoints ? keyPoints.split('\n') : []),
      detailedExplanation: detailedExplanation || '',
      practicalExamples: practicalExamples || [],
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      isPinned: Boolean(isPinned),
      color: color || 'blue',
    });

    await dbAdapter.progress.update(req.user._id, {
      minutes: 15,
      activity: {
        activityType: 'note',
        title: `Saved Note: ${title}`,
        details: `Subject: ${subject}`,
        timestamp: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Note saved successfully!',
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Notes for current user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const { search, subject } = req.query;
    const notes = await dbAdapter.notes.find({
      user: req.user._id,
      search,
      subject,
    });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await dbAdapter.notes.findById(req.params.id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    return res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const updatedNote = await dbAdapter.notes.update(req.params.id, req.user._id, req.body);
    if (!updatedNote) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully!',
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await dbAdapter.notes.delete(req.params.id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    return res.status(200).json({ success: true, message: 'Note deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePinNote = async (req, res, next) => {
  try {
    const note = await dbAdapter.notes.findById(req.params.id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    const updated = await dbAdapter.notes.update(req.params.id, req.user._id, { isPinned: !note.isPinned });

    return res.status(200).json({
      success: true,
      message: updated.isPinned ? 'Note pinned' : 'Note unpinned',
      isPinned: updated.isPinned,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateNotes,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePinNote,
};
