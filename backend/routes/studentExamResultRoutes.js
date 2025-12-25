const express = require('express');
const router = express.Router();
const {
  getPublishedExams,
  getStudentExamResults,
  getFinalResult,
  publishExamResults,
  publishFinalResults,
  getStudentAcademicYears,
  getStudentClasses
} = require('../controllers/studentExamResultController');
const { authenticate, superAdminAuthentication } = require('../middleware/authMiddleware');

// Student routes - accessible by students and parents
router.get('/student/academic-years', authenticate, getStudentAcademicYears);
router.get('/student/classes', authenticate, getStudentClasses);
router.get('/student/published', authenticate, getPublishedExams);
router.get('/student/results', authenticate, getStudentExamResults);
router.get('/student/final-result', authenticate, getFinalResult);

// Admin routes - only for super admin
router.post('/publish', superAdminAuthentication, publishExamResults);
router.post('/publish-final', superAdminAuthentication, publishFinalResults);

module.exports = router;
