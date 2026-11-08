const dbAdapter = require('../utils/dbAdapter');
const aiService = require('../services/aiService');

// @desc    Generate AI Quiz
// @route   POST /api/quizzes/generate
// @access  Private
const generateAIQuiz = async (req, res, next) => {
  try {
    const { topic, subject, difficulty = 'Medium', count = 5 } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both topic and subject to generate a quiz.',
      });
    }

    const aiData = await aiService.generateQuiz({ topic, subject, difficulty, count: Number(count) });

    const formattedQuestions = (aiData.questions || []).map((q) => {
      let opts = Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];
      while (opts.length < 4) {
        opts.push(`Additional Option ${opts.length + 1}`);
      }
      if (opts.length > 4) {
        opts = opts.slice(0, 4);
      }
      return {
        questionText: q.questionText || 'Question text',
        options: opts,
        correctAnswerIndex: typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex >= 0 && q.correctAnswerIndex <= 3 ? q.correctAnswerIndex : 0,
        explanation: q.explanation || 'Review the core subject definitions.',
      };
    });

    const quiz = await dbAdapter.quizzes.create({
      user: req.user._id,
      title: aiData.title || `${subject}: ${topic} Exam`,
      subject,
      topic,
      difficulty,
      questions: formattedQuestions,
      totalQuestions: formattedQuestions.length,
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz generated successfully!',
      quiz,
      aiProvider: aiData.source,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await dbAdapter.quizzes.find(req.user._id);
    return res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID for taking test
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await dbAdapter.quizzes.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    return res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Quiz Attempt & Calculate Score
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuizAttempt = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds = 60 } = req.body;
    const quiz = await dbAdapter.quizzes.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const detailedAnswers = quiz.questions.map((q, idx) => {
      const selected = answers ? answers[idx] : undefined;
      const isCorrect = Number(selected) === q.correctAnswerIndex;
      if (isCorrect) correctCount += 1;

      return {
        questionIndex: idx,
        questionText: q.questionText,
        selectedOption: selected !== undefined ? Number(selected) : null,
        correctOption: q.correctAnswerIndex,
        isCorrect: Boolean(isCorrect),
        explanation: q.explanation,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attempt = await dbAdapter.quizAttempts.create({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      userAnswers: detailedAnswers,
      score: correctCount,
      totalQuestions,
      percentage,
      timeSpentSeconds: Number(timeSpentSeconds),
    });

    await dbAdapter.progress.update(req.user._id, {
      minutes: Math.max(5, Math.round(timeSpentSeconds / 60)),
      activity: {
        activityType: 'quiz',
        title: `Completed Quiz: ${quiz.title}`,
        details: `Score: ${correctCount}/${totalQuestions} (${percentage}%) in ${quiz.subject}`,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully!',
      result: {
        attemptId: attempt._id,
        score: correctCount,
        totalQuestions,
        percentage,
        timeSpentSeconds,
        userAnswers: detailedAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's previous quiz attempts
// @route   GET /api/quizzes/attempts/history
// @access  Private
const getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await dbAdapter.quizAttempts.find(req.user._id);
    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await dbAdapter.quizzes.delete(req.params.id, req.user._id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    return res.status(200).json({ success: true, message: 'Quiz deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAIQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getUserAttempts,
  deleteQuiz,
};
