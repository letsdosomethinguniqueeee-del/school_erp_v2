const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

// Fee structure management
router.get('/', feeController.getAllFees); // all fee structures
router.get('/:id', feeController.getFeeById); // fee structure by _id
router.get('/class/:class/:sessionYear', feeController.getFeeByClass); // fee structure by class and session
router.post('/', feeController.createFee);
router.patch('/:id', feeController.updateFee);
router.delete('/:id', feeController.deleteFee);

module.exports = router;
