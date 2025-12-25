const express = require('express');
const router = express.Router();
const {
  saveMarksBulk,
  getMarks,
  getStudentMarks,
  deleteMarks,
  updateMarks
} = require('../controllers/examinationMarksController');
const { authenticate } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Save marks in bulk
router.post('/bulk', saveMarksBulk);

// Get marks based on filters
router.get('/', getMarks);

// Get marks for a specific student
router.get('/student/:studentId', getStudentMarks);

// Update marks entry
router.put('/:id', updateMarks);

// Delete marks entry
router.delete('/:id', deleteMarks);

module.exports = router;
