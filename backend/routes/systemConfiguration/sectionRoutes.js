const express = require('express');
const router = express.Router();
const sectionController = require('../../controllers/systemConfiguration/sectionController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateSection, validateSectionUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Section routes
router.post('/', validateSection, sectionController.createSection);
router.get('/', sectionController.getAllSections);
router.get('/active', sectionController.getActiveSections);
router.get('/:id', sectionController.getSectionById);
router.put('/:id', validateSectionUpdate, sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

module.exports = router;
