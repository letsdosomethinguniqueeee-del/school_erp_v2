const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transactions API
router.get('/', transactionController.getAllTransactions);
router.get(
  '/student/:studentId',
  transactionController.getTransactionsByStudent
);
router.get('/student/:studentId/summary', transactionController.getStudentFeeSummary);
router.get('/:id', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.patch('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
