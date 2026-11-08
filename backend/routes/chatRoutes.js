const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatSessions,
  getSessionById,
  createChatSession,
  deleteChatSession,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/message', sendMessage);
router.route('/sessions')
  .get(getChatSessions)
  .post(createChatSession);

router.route('/sessions/:id')
  .get(getSessionById)
  .delete(deleteChatSession);

module.exports = router;
