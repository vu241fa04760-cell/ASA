const mongoose = require('mongoose');
const store = require('./memoryStore');
const bcrypt = require('bcryptjs');

const isConnected = () => mongoose.connection.readyState === 1;

// Helper to generate simple ObjectId string
const newId = () => new mongoose.Types.ObjectId().toString();

const dbAdapter = {
  isConnected,

  // User methods
  users: {
    findByEmail: async (email) => {
      if (isConnected()) {
        const User = require('../models/User');
        return await User.findOne({ email }).select('+password');
      }
      return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    findById: async (id) => {
      if (isConnected()) {
        const User = require('../models/User');
        return await User.findById(id);
      }
      return store.users.find((u) => String(u._id) === String(id));
    },
    create: async (userData) => {
      if (isConnected()) {
        const User = require('../models/User');
        return await User.create(userData);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = {
        _id: newId(),
        ...userData,
        password: hashedPassword,
        learningPreferences: {
          dailyGoalMinutes: 60,
          preferredSubject: 'Computer Science',
          difficultyLevel: 'Intermediate',
          darkMode: false,
          emailNotifications: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.push(user);
      return user;
    },
    update: async (id, updateData) => {
      if (isConnected()) {
        const User = require('../models/User');
        return await User.findByIdAndUpdate(id, updateData, { new: true });
      }
      const user = store.users.find((u) => String(u._id) === String(id));
      if (!user) return null;
      Object.assign(user, updateData, { updatedAt: new Date() });
      return user;
    },
  },

  // Notes methods
  notes: {
    find: async (filters = {}) => {
      if (isConnected()) {
        const Note = require('../models/Note');
        const q = { user: filters.user };
        if (filters.subject && filters.subject !== 'all') {
          q.subject = { $regex: new RegExp(filters.subject, 'i') };
        }
        if (filters.search) {
          q.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { topic: { $regex: filters.search, $options: 'i' } },
            { summary: { $regex: filters.search, $options: 'i' } },
          ];
        }
        return await Note.find(q).sort({ isPinned: -1, updatedAt: -1 });
      }
      let list = [...store.notes];
      if (filters.user) {
        list = list.filter((n) => String(n.user) === String(filters.user));
      }
      if (filters.subject && filters.subject !== 'all') {
        const reg = new RegExp(filters.subject, 'i');
        list = list.filter((n) => reg.test(n.subject));
      }
      if (filters.search) {
        const reg = new RegExp(filters.search, 'i');
        list = list.filter(
          (n) => reg.test(n.title) || reg.test(n.topic) || reg.test(n.summary)
        );
      }
      return list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    },
    findById: async (id, userId) => {
      if (isConnected()) {
        const Note = require('../models/Note');
        return await Note.findOne({ _id: id, user: userId });
      }
      return store.notes.find((n) => String(n._id) === String(id) && String(n.user) === String(userId));
    },
    create: async (noteData) => {
      if (isConnected()) {
        const Note = require('../models/Note');
        return await Note.create(noteData);
      }
      const note = {
        _id: newId(),
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.notes.unshift(note);
      return note;
    },
    update: async (id, userId, updateData) => {
      if (isConnected()) {
        const Note = require('../models/Note');
        return await Note.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true });
      }
      const note = store.notes.find((n) => String(n._id) === String(id) && String(n.user) === String(userId));
      if (!note) return null;
      Object.assign(note, updateData, { updatedAt: new Date() });
      return note;
    },
    delete: async (id, userId) => {
      if (isConnected()) {
        const Note = require('../models/Note');
        return await Note.findOneAndDelete({ _id: id, user: userId });
      }
      const idx = store.notes.findIndex((n) => String(n._id) === String(id) && String(n.user) === String(userId));
      if (idx === -1) return null;
      const removed = store.notes.splice(idx, 1);
      return removed[0];
    },
  },

  // Quizzes methods
  quizzes: {
    find: async (userId) => {
      if (isConnected()) {
        const Quiz = require('../models/Quiz');
        const conditions = [{ isPublic: true }];
        if (userId && typeof userId === 'string' && userId.length === 24) {
          conditions.unshift({ user: userId });
        } else if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          conditions.unshift({ user: userId });
        }
        return await Quiz.find(conditions.length > 1 ? { $or: conditions } : { isPublic: true }).sort({ createdAt: -1 });
      }
      return store.quizzes.filter((q) => !userId || String(q.user) === String(userId) || q.isPublic);
    },
    findById: async (id) => {
      if (isConnected()) {
        const Quiz = require('../models/Quiz');
        return await Quiz.findById(id);
      }
      return store.quizzes.find((q) => String(q._id) === String(id));
    },
    create: async (quizData) => {
      if (isConnected()) {
        const Quiz = require('../models/Quiz');
        return await Quiz.create(quizData);
      }
      const quiz = {
        _id: newId(),
        ...quizData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.quizzes.unshift(quiz);
      return quiz;
    },
    delete: async (id, userId) => {
      if (isConnected()) {
        const Quiz = require('../models/Quiz');
        return await Quiz.findOneAndDelete({ _id: id, user: userId });
      }
      const idx = store.quizzes.findIndex((q) => String(q._id) === String(id) && String(q.user) === String(userId));
      if (idx === -1) return null;
      return store.quizzes.splice(idx, 1)[0];
    },
  },

  // Quiz Attempts
  quizAttempts: {
    find: async (userId) => {
      if (isConnected()) {
        const QuizAttempt = require('../models/QuizAttempt');
        return await QuizAttempt.find({ user: userId }).sort({ createdAt: -1 });
      }
      return store.quizAttempts.filter((a) => String(a.user) === String(userId));
    },
    create: async (attemptData) => {
      if (isConnected()) {
        const QuizAttempt = require('../models/QuizAttempt');
        return await QuizAttempt.create(attemptData);
      }
      const attempt = {
        _id: newId(),
        ...attemptData,
        createdAt: new Date(),
      };
      store.quizAttempts.unshift(attempt);
      return attempt;
    },
  },

  // Study Tasks (Planner)
  studyTasks: {
    find: async (userId, filters = {}) => {
      if (isConnected()) {
        const StudyTask = require('../models/StudyTask');
        const q = { user: userId };
        if (filters.status && filters.status !== 'all') q.status = filters.status;
        return await StudyTask.find(q).sort({ targetDate: 1, priority: -1 });
      }
      let list = store.studyTasks.filter((t) => String(t.user) === String(userId));
      if (filters.status && filters.status !== 'all') {
        list = list.filter((t) => t.status === filters.status);
      }
      return list.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
    },
    create: async (taskData) => {
      if (isConnected()) {
        const StudyTask = require('../models/StudyTask');
        return await StudyTask.create(taskData);
      }
      const task = {
        _id: newId(),
        ...taskData,
        status: taskData.status || 'pending',
        createdAt: new Date(),
      };
      store.studyTasks.push(task);
      return task;
    },
    update: async (id, userId, updateData) => {
      if (isConnected()) {
        const StudyTask = require('../models/StudyTask');
        return await StudyTask.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true });
      }
      const task = store.studyTasks.find((t) => String(t._id) === String(id) && String(t.user) === String(userId));
      if (!task) return null;
      Object.assign(task, updateData);
      return task;
    },
    delete: async (id, userId) => {
      if (isConnected()) {
        const StudyTask = require('../models/StudyTask');
        return await StudyTask.findOneAndDelete({ _id: id, user: userId });
      }
      const idx = store.studyTasks.findIndex((t) => String(t._id) === String(id) && String(t.user) === String(userId));
      if (idx === -1) return null;
      return store.studyTasks.splice(idx, 1)[0];
    },
  },

  // Documents
  documents: {
    find: async (userId) => {
      if (isConnected()) {
        const Document = require('../models/Document');
        return await Document.find({ user: userId }).sort({ createdAt: -1 });
      }
      return store.documents.filter((d) => String(d.user) === String(userId));
    },
    findById: async (id, userId) => {
      if (isConnected()) {
        const Document = require('../models/Document');
        return await Document.findOne({ _id: id, user: userId });
      }
      return store.documents.find((d) => String(d._id) === String(id) && String(d.user) === String(userId));
    },
    create: async (docData) => {
      if (isConnected()) {
        const Document = require('../models/Document');
        return await Document.create(docData);
      }
      const doc = {
        _id: newId(),
        ...docData,
        createdAt: new Date(),
      };
      store.documents.unshift(doc);
      return doc;
    },
    delete: async (id, userId) => {
      if (isConnected()) {
        const Document = require('../models/Document');
        return await Document.findOneAndDelete({ _id: id, user: userId });
      }
      const idx = store.documents.findIndex((d) => String(d._id) === String(id) && String(d.user) === String(userId));
      if (idx === -1) return null;
      return store.documents.splice(idx, 1)[0];
    },
  },

  // Chat History
  chatHistories: {
    findSessions: async (userId) => {
      if (isConnected()) {
        const ChatHistory = require('../models/ChatHistory');
        return await ChatHistory.find({ user: userId }).select('title subject updatedAt createdAt').sort({ updatedAt: -1 });
      }
      return store.chatHistories
        .filter((c) => String(c.user) === String(userId))
        .map((c) => ({
          _id: c._id,
          title: c.title,
          subject: c.subject,
          updatedAt: c.updatedAt,
          createdAt: c.createdAt,
        }));
    },
    findById: async (id, userId) => {
      if (isConnected()) {
        const ChatHistory = require('../models/ChatHistory');
        return await ChatHistory.findOne({ _id: id, user: userId });
      }
      return store.chatHistories.find((c) => String(c._id) === String(id) && String(c.user) === String(userId));
    },
    create: async (sessionData) => {
      if (isConnected()) {
        const ChatHistory = require('../models/ChatHistory');
        return await ChatHistory.create(sessionData);
      }
      const session = {
        _id: newId(),
        ...sessionData,
        messages: sessionData.messages || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.chatHistories.unshift(session);
      return session;
    },
    delete: async (id, userId) => {
      if (isConnected()) {
        const ChatHistory = require('../models/ChatHistory');
        return await ChatHistory.findOneAndDelete({ _id: id, user: userId });
      }
      const idx = store.chatHistories.findIndex((c) => String(c._id) === String(id) && String(c.user) === String(userId));
      if (idx === -1) return null;
      return store.chatHistories.splice(idx, 1)[0];
    },
  },

  // Progress
  progress: {
    get: async (userId) => {
      if (isConnected()) {
        const UserProgress = require('../models/UserProgress');
        return await UserProgress.findOne({ user: userId });
      }
      return store.userProgress;
    },
    update: async (userId, delta = {}) => {
      if (isConnected()) {
        const UserProgress = require('../models/UserProgress');
        return await UserProgress.findOneAndUpdate({ user: userId }, delta, { upsert: true, new: true });
      }
      if (delta.minutes) store.userProgress.totalStudyMinutes += delta.minutes;
      if (delta.activity) {
        store.userProgress.recentActivities.unshift(delta.activity);
      }
      return store.userProgress;
    },
  },
};

module.exports = dbAdapter;
