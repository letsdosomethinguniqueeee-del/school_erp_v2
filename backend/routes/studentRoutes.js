const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// None - all student data requires authentication

// Protected routes - require authentication
router.use(authenticate); // All routes below require authentication

// Read access for teachers, admins, super-admins, and staff
router.get('/', authorizeRoles('teacher', 'admin', 'super-admin', 'staff'), studentController.getAllStudents);
router.get('/check-roll-no', authorizeRoles('admin', 'super-admin', 'staff'), studentController.checkRollNumberUniqueness);
router.get('/:id', authorizeRoles('teacher', 'admin', 'super-admin', 'staff'), studentController.getStudentById);

// Create access for admins, super-admins, and staff (admission process)
router.post('/', authorizeRoles('admin', 'super-admin', 'staff'), studentController.createStudent);

// Update access for admins and super-admins only
router.patch('/:id', authorizeRoles('admin', 'super-admin'), studentController.updateStudent);
router.put('/:id', authorizeRoles('admin', 'super-admin'), studentController.updateStudent);

// Delete access for super-admins only (critical operation)
router.delete('/:id', authorizeRoles('super-admin'), studentController.deleteStudent);

module.exports = router;
