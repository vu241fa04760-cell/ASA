const express = require('express');
const router = express.Router();
const {
  generateAIQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getUserAttempts,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateAIQuiz);
router.get('/', getQuizzes);
router.get('/attempts/history', getUserAttempts);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuizAttempt);
router.delete('/:id', deleteQuiz);

module.exports = router;
