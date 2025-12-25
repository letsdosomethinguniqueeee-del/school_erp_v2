const express = require('express');
const router = express.Router();
const examinationController = require('../../controllers/systemConfiguration/examinationController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateExamination, validateExaminationUpdate } = require('../../utils/validation');

// Protect all routes
router.use(authenticate);

router.post('/bulk', examinationController.createBulkExaminations);
router.post('/', validateExamination, examinationController.createExamination);
router.get('/', examinationController.getAllExaminations);
router.get('/:id', examinationController.getExaminationById);
router.put('/:id', validateExaminationUpdate, examinationController.updateExamination);
router.delete('/:id', examinationController.deleteExamination);

module.exports = router;
