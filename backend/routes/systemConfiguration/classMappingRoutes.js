const express = require('express');
const router = express.Router();
const classMappingController = require('../../controllers/systemConfiguration/classMappingController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateClassMapping, validateClassMappingUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Class mapping routes
router.post('/', validateClassMapping, classMappingController.createClassMapping);
router.get('/', classMappingController.getAllClassMappings);
router.get('/active', classMappingController.getActiveClassMappings);
router.get('/:id', classMappingController.getClassMappingById);
router.put('/:id', validateClassMappingUpdate, classMappingController.updateClassMapping);
router.delete('/:id', classMappingController.deleteClassMapping);

module.exports = router;