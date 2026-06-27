const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume, getAnalyses, getAnalysisById, getSampleJobDescription, createCoverLetter, generateBuilderData, deleteAnalysis } = require('../controllers/resumeController');

router.get('/sample-jd', protect, getSampleJobDescription);
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/cover-letter', protect, upload.single('resume'), createCoverLetter);
router.post('/build', protect, generateBuilderData);
router.get('/', protect, getAnalyses);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
