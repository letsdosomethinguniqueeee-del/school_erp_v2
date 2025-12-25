const express = require('express');
const router = express.Router();
const academicYearController = require('../../controllers/systemConfiguration/academicYearController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateAcademicYear, validateAcademicYearUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Academic Year CRUD routes
router.post('/', validateAcademicYear, academicYearController.createAcademicYear);
router.get('/', academicYearController.getAllAcademicYears);
router.get('/current', academicYearController.getCurrentAcademicYear);
router.get('/:id', academicYearController.getAcademicYearById);
router.put('/:id', validateAcademicYearUpdate, academicYearController.updateAcademicYear);
router.delete('/:id', academicYearController.deleteAcademicYear);

module.exports = router;