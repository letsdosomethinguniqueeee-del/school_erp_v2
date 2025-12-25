const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes

// Admin can view all students and fees
router.get('/fees', adminController.getAllStudentsWithFees);

// Admin can view a single student with fees + transactions
router.get('/fees/student/:studentId', adminController.getStudentFeeDetails);

module.exports = router;
