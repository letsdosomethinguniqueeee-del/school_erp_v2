const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/systemConfiguration/subjectController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateSubject, validateSubjectUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Subject routes
router.post('/', validateSubject, subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.get('/active', subjectController.getActiveSubjects);
router.get('/:id', subjectController.getSubjectById);
router.put('/:id', validateSubjectUpdate, subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
