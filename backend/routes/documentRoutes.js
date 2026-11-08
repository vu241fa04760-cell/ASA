const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadAndSummarizeDocument,
  askDocumentQuestion,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/upload', upload.single('file'), uploadAndSummarizeDocument);
router.get('/', getUserDocuments);
router.get('/:id', getDocumentById);
router.post('/:id/ask', askDocumentQuestion);
router.delete('/:id', deleteDocument);

module.exports = router;
