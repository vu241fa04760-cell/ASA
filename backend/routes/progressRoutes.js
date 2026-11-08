const express = require('express');
const router = express.Router();
const {
  getDashboardProgress,
  logStudyTime,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardProgress);
router.post('/log-study-time', logStudyTime);

module.exports = router;
