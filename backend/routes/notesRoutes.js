const express = require('express');
const router = express.Router();
const {
  generateNotes,
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePinNote,
} = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateNotes);
router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.patch('/:id/pin', togglePinNote);

module.exports = router;
