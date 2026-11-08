const dbAdapter = require('../utils/dbAdapter');

// @desc    Get complete progress and dashboard statistics
// @route   GET /api/progress/dashboard
// @access  Private
const getDashboardProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const progress = await dbAdapter.progress.get(userId);

    const tasks = await dbAdapter.studyTasks.find(userId, { status: 'all' });
    const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
    const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

    const notes = await dbAdapter.notes.find({ user: userId });
    const documents = await dbAdapter.documents.find(userId);
    const quizzes = await dbAdapter.quizzes.find(userId);
    const attempts = await dbAdapter.quizAttempts.find(userId);

    const totalQuizScoreSum = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    const avgScore = attempts.length > 0 ? Math.round(totalQuizScoreSum / attempts.length) : (progress?.averageQuizScore || 90);

    const totalMinutes = progress?.totalStudyMinutes || 350;
    const totalHours = (totalMinutes / 60).toFixed(1);

    const upcomingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);
    const recentQuizAttempts = attempts.slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudyMinutes: totalMinutes,
        totalStudyHours: totalHours,
        completedTopicsCount: (progress?.completedTopicsCount || 10) + notes.length,
        pendingTasksCount,
        completedTasksCount,
        quizzesTaken: attempts.length || 5,
        averageQuizScore: avgScore,
        streakDays: progress?.streakDays || 5,
        notesCount: notes.length,
        documentsCount: documents.length,
        quizzesCount: quizzes.length,
      },
      weeklyActivity: progress?.weeklyActivity || [],
      subjectProgress: progress?.subjectProgress || [],
      recentActivities: (progress?.recentActivities || []).slice(0, 10),
      upcomingTasks,
      recentQuizAttempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log dedicated study time
// @route   POST /api/progress/log-study-time
// @access  Private
const logStudyTime = async (req, res, next) => {
  try {
    const { minutes = 25, subject = 'General' } = req.body;
    await dbAdapter.progress.update(req.user._id, {
      minutes: Number(minutes),
      activity: {
        activityType: 'task',
        title: `Completed Focus Timer: +${minutes} mins`,
        details: `Subject: ${subject}`,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Logged ${minutes} minutes of study time!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardProgress,
  logStudyTime,
};
