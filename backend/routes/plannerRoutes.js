const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/tasks')
  .get(getTasks)
  .post(createTask);

router.route('/tasks/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/tasks/:id/toggle', toggleTaskStatus);

module.exports = router;
