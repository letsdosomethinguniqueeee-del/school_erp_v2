const express = require('express');
const router = express.Router();
const mediumController = require('../../controllers/systemConfiguration/mediumController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateMedium, validateMediumUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Medium routes
router.post('/', validateMedium, mediumController.createMedium);
router.get('/', mediumController.getAllMediums);
router.get('/active', mediumController.getActiveMediums);
router.get('/:id', mediumController.getMediumById);
router.put('/:id', validateMediumUpdate, mediumController.updateMedium);
router.delete('/:id', mediumController.deleteMedium);

module.exports = router;
