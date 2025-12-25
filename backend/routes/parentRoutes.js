const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

// CRUD or profile routes for parents
router.get('/', parentController.getAllParents);
router.get('/:id', parentController.getParentById);
router.post('/', parentController.createParent);
router.patch('/:id', parentController.updateParent);
router.delete('/:id', parentController.deleteParent);

module.exports = router;
