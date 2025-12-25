const express = require('express');
const router = express.Router();
const classController = require('../../controllers/systemConfiguration/classController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateClass, validateClassUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Class routes
router.post('/', validateClass, classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/active', classController.getActiveClasses);
router.get('/:id', classController.getClassById);
router.put('/:id', validateClassUpdate, classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;
