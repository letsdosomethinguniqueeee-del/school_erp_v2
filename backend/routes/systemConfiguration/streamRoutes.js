const express = require('express');
const router = express.Router();
const streamController = require('../../controllers/systemConfiguration/streamController');
const { authenticate } = require('../../middleware/authMiddleware');
const { validateStream, validateStreamUpdate } = require('../../utils/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// Stream routes
router.post('/', validateStream, streamController.createStream);
router.get('/', streamController.getAllStreams);
router.get('/active', streamController.getActiveStreams);
router.get('/:id', streamController.getStreamById);
router.put('/:id', validateStreamUpdate, streamController.updateStream);
router.delete('/:id', streamController.deleteStream);

module.exports = router;
