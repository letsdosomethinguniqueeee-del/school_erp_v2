const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Password-based Authentication
router.post('/login', authController.loginWithPassword); // Login using userId & password
router.post('/logout', authController.logout); // Logout
router.get('/check', authController.checkAuth); // Check authentication status

module.exports = router;