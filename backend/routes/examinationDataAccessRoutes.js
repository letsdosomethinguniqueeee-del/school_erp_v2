const express = require('express');
const router = express.Router();
const {
  createExaminationDataAccess,
  getAllExaminationDataAccess,
  getExaminationDataAccessById,
  updateExaminationDataAccess,
  deleteExaminationDataAccess,
  checkUserAccess
} = require('../controllers/examinationDataAccessController');
const { authenticate } = require('../middleware/authMiddleware');
const { 
  validateExaminationDataAccess, 
  validateExaminationDataAccessUpdate,
  validateRequest 
} = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

// Create new examination data access
router.post('/', validateExaminationDataAccess, validateRequest, createExaminationDataAccess);

// Get all examination data access records
router.get('/', getAllExaminationDataAccess);

// Check user access (GET method with user_id in params)
router.get('/check-access/:user_id', checkUserAccess);

// Check user access (POST method with data in body - uses current user from token)
router.post('/check-access', checkUserAccess);

// Get examination data access by ID
router.get('/:id', getExaminationDataAccessById);

// Update examination data access
router.put('/:id', validateExaminationDataAccessUpdate, validateRequest, updateExaminationDataAccess);

// Delete examination data access
router.delete('/:id', deleteExaminationDataAccess);

module.exports = router;
