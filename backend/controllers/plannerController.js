const dbAdapter = require('../utils/dbAdapter');

// @desc    Get all study tasks for user
// @route   GET /api/planner/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const tasks = await dbAdapter.studyTasks.find(req.user._id, { status });

    const allTasks = await dbAdapter.studyTasks.find(req.user._id, { status: 'all' });
    const stats = {
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
    };

    return res.status(200).json({
      success: true,
      stats,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new study task
// @route   POST /api/planner/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, subject, description, targetDate, estimatedMinutes, priority } = req.body;

    if (!title || !subject || !targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title, subject, and target date.',
      });
    }

    const task = await dbAdapter.studyTasks.create({
      user: req.user._id,
      title,
      subject,
      description: description || '',
      targetDate: new Date(targetDate),
      estimatedMinutes: Number(estimatedMinutes) || 45,
      priority: priority || 'medium',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Study task created successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update study task
// @route   PUT /api/planner/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await dbAdapter.studyTasks.update(req.params.id, req.user._id, req.body);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Study task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status
// @route   PATCH /api/planner/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    const tasks = await dbAdapter.studyTasks.find(req.user._id, { status: 'all' });
    const task = tasks.find((t) => String(t._id) === String(req.params.id));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Study task not found' });
    }

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated = await dbAdapter.studyTasks.update(req.params.id, req.user._id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : null,
    });

    if (newStatus === 'completed') {
      await dbAdapter.progress.update(req.user._id, {
        minutes: task.estimatedMinutes || 30,
        activity: {
          activityType: 'task',
          title: `Completed Goal: ${task.title}`,
          details: `Subject: ${task.subject}`,
          timestamp: new Date(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Task marked as ${newStatus}`,
      task: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study task
// @route   DELETE /api/planner/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await dbAdapter.studyTasks.delete(req.params.id, req.user._id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Study task not found' });
    }
    return res.status(200).json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
