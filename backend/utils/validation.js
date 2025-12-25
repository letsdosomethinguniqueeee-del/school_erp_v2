const { body, validationResult } = require('express-validator');

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>\"'&]/g, '');
};

// Role-based userId validation
const isValidUserId = (userId, role) => {
  if (!userId || typeof userId !== 'string') return false;
  
  const sanitizedUserId = sanitizeInput(userId);
  
  // Allow alphanumeric usernames for students and super-admin
  if (role === 'student' || role === 'super-admin' || role === 'superadmin') {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(sanitizedUserId);
  }
  
  // For other roles (admin, teacher, parent, staff), require mobile number format
  return /^[0-9]{10,15}$/.test(sanitizedUserId);
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Student validation rules
const validateStudent = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Student ID must be between 3 and 20 characters'),
  
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('rollNo')
    .notEmpty()
    .withMessage('Roll number is required'),
  
  body('fatherFirstName')
    .notEmpty()
    .withMessage('Father\'s first name is required'),
  
  body('motherFirstName')
    .notEmpty()
    .withMessage('Mother\'s first name is required'),
  
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  
  body('concessionPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Concession percentage must be between 0 and 100'),
  
  validateRequest
];

// User validation rules
const validateUser = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('User ID must be between 3 and 20 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'super-admin', 'teacher', 'student', 'parent', 'staff'])
    .withMessage('Invalid role specified'),
  
  validateRequest
];

// Login validation rules
const validateLogin = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'super-admin', 'teacher', 'student', 'parent', 'staff'])
    .withMessage('Invalid role specified'),
  
  validateRequest
];

// Academic Year validation rules
const validateAcademicYear = [
  body('year_code')
    .notEmpty()
    .withMessage('Year code is required')
    .isLength({ min: 4, max: 10 })
    .withMessage('Year code must be between 4 and 10 characters')
    .matches(/^[0-9]{4}-[0-9]{2}$/)
    .withMessage('Year code must be in format YYYY-YY (e.g., 2024-25)'),
  
  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()

    .isIn(['upcoming', 'current', 'completed'])
    .withMessage('Status must be one of: upcoming, current, completed'),
  
  validateRequest
];

// Academic Year update validation rules
const validateAcademicYearUpdate = [
  body('year_code')
    .optional()
    .isLength({ min: 4, max: 10 })
    .withMessage('Year code must be between 4 and 10 characters')
    .matches(/^[0-9]{4}-[0-9]{2}$/)
    .withMessage('Year code must be in format YYYY-YY (e.g., 2024-25)'),
  
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),

  
  validateRequest
];

// Subject validation
const validateSubject = [
  body('subject_code')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Subject code is required and must be between 1-20 characters'),
  
  body('subject_name')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject name is required and must be between 1-100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

const validateSubjectUpdate = [
  body('subject_code')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Subject code must be between 1-20 characters'),
  
  body('subject_name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject name must be between 1-100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

// Stream validation rules
const validateStream = [
  body('stream_code')
    .notEmpty()
    .withMessage('Stream code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Stream code must be between 2 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Stream code must contain only uppercase letters and numbers'),
  
  body('stream_name')
    .notEmpty()
    .withMessage('Stream name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Stream name must be between 2 and 100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

const validateStreamUpdate = [
  body('stream_code')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('Stream code must be between 2 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Stream code must contain only uppercase letters and numbers'),
  
  body('stream_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Stream name must be between 2 and 100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

// Medium validation rules
const validateMedium = [
  body('medium_code')
    .notEmpty()
    .withMessage('Medium code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Medium code must be between 2 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Medium code must contain only uppercase letters and numbers'),
  
  body('medium_name')
    .notEmpty()
    .withMessage('Medium name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Medium name must be between 2 and 100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

const validateMediumUpdate = [
  body('medium_code')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('Medium code must be between 2 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Medium code must contain only uppercase letters and numbers'),
  
  body('medium_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Medium name must be between 2 and 100 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

// Class validation rules
const validateClass = [
  body('class_code')
    .notEmpty()
    .withMessage('Class code is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Class code must be between 1 and 10 characters'),
  
  body('class_name')
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Class name must be between 2 and 100 characters'),
  
  body('class_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Class order must be a non-negative integer'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

const validateClassUpdate = [
  body('class_code')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Class code must be between 1 and 10 characters'),
  
  body('class_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Class name must be between 2 and 100 characters'),
  
  body('class_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Class order must be a non-negative integer'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

// Section validation rules
const validateSection = [
  body('section_code')
    .notEmpty()
    .withMessage('Section code is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Section code must be between 1 and 10 characters'),
  
  body('section_name')
    .notEmpty()
    .withMessage('Section name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Section name must be between 2 and 100 characters'),
  
  body('section_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Section order must be a non-negative integer'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

const validateSectionUpdate = [
  body('section_code')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Section code must be between 1 and 10 characters'),
  
  body('section_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Section name must be between 2 and 100 characters'),
  
  body('section_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Section order must be a non-negative integer'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

// Examination validation rules
const validateExamination = [
  body('exam_code')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Examination code is required and must be between 1-20 characters'),

  body('exam_name')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Examination name is required and must be between 1-100 characters'),
  // exam_date and is_active removed - not required for examinations

  validateRequest
];

const validateExaminationUpdate = [
  body('exam_code')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Examination code must be between 1-20 characters'),

  body('exam_name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Examination name must be between 1-100 characters'),

  // exam_date and is_active removed - not required for examinations

  validateRequest
];

// Class Mapping validation rules
const validateClassMapping = [
  body('class_name')
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Class name must be between 2 and 100 characters'),
  
  body('medium')
    .notEmpty()
    .withMessage('Medium is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Medium must be between 2 and 100 characters'),
  
  body('stream')
    .notEmpty()
    .withMessage('Stream is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Stream must be between 2 and 100 characters'),
  
  body('subjects')
    .isArray({ min: 1 })

    .withMessage('At least one subject must be selected'),
  
  validateRequest
];

const validateClassMappingUpdate = [
  body('class_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Class name must be between 2 and 100 characters'),
  
  body('medium')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Medium must be between 2 and 100 characters'),
  
  body('stream')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Stream must be between 2 and 100 characters'),
  
  body('subjects')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one subject must be selected'),
  
  body('sections')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one section must be selected'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  validateRequest
];

module.exports = {
  sanitizeInput,
  isValidUserId,
  validateRequest,
  validateStudent,
  validateUser,
  validateLogin,
  validateAcademicYear,
  validateAcademicYearUpdate,
  validateSubject,
  validateSubjectUpdate,
  validateStream,
  validateStreamUpdate,
  validateMedium,
  validateMediumUpdate,
  validateClass,
  validateClassUpdate,
  validateSection,
  validateSectionUpdate,
  validateClassMapping,
  validateClassMappingUpdate
  ,validateExamination
  ,validateExaminationUpdate
};

// Examination Data Access validation rules
const validateExaminationDataAccess = [
  body('academic_year_id')
    .notEmpty()
    .withMessage('Academic year is required')
    .isMongoId()
    .withMessage('Invalid academic year ID'),
  
  body('user_ids')
    .isArray({ min: 1 })
    .withMessage('At least one user must be selected'),
  
  body('user_ids.*')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('permissions.view')
    .optional()
    .isBoolean()
    .withMessage('View permission must be a boolean'),
  
  body('permissions.edit')
    .optional()
    .isBoolean()
    .withMessage('Edit permission must be a boolean'),
  
  body('class_ids')
    .optional()
    .isArray()
    .withMessage('Class IDs must be an array'),
  
  body('class_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid class ID'),
  
  body('section_ids')
    .optional()
    .isArray()
    .withMessage('Section IDs must be an array'),
  
  body('section_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid section ID'),
  
  body('medium_ids')
    .optional()
    .isArray()
    .withMessage('Medium IDs must be an array'),
  
  body('medium_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid medium ID'),
  
  body('subject_ids')
    .optional()
    .isArray()
    .withMessage('Subject IDs must be an array'),
  
  body('subject_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid subject ID')
];

const validateExaminationDataAccessUpdate = [
  body('academic_year_id')
    .optional()
    .isMongoId()
    .withMessage('Invalid academic year ID'),
  
  body('user_ids')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one user must be selected'),
  
  body('user_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('permissions.view')
    .optional()
    .isBoolean()
    .withMessage('View permission must be a boolean'),
  
  body('permissions.edit')
    .optional()
    .isBoolean()
    .withMessage('Edit permission must be a boolean'),
  
  body('class_ids')
    .optional()
    .isArray()
    .withMessage('Class IDs must be an array'),
  
  body('class_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid class ID'),
  
  body('section_ids')
    .optional()
    .isArray()
    .withMessage('Section IDs must be an array'),
  
  body('section_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid section ID'),
  
  body('medium_ids')
    .optional()
    .isArray()
    .withMessage('Medium IDs must be an array'),
  
  body('medium_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid medium ID'),
  
  body('subject_ids')
    .optional()
    .isArray()
    .withMessage('Subject IDs must be an array'),
  
  body('subject_ids.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid subject ID')
];

module.exports = {
  sanitizeInput,
  isValidUserId,
  validateRequest,
  validateStudent,
  validateUser,
  validateLogin,
  validateAcademicYear,
  validateAcademicYearUpdate,
  validateSubject,
  validateSubjectUpdate,
  validateStream,
  validateStreamUpdate,
  validateMedium,
  validateMediumUpdate,
  validateClass,
  validateClassUpdate,
  validateSection,
  validateSectionUpdate,
  validateClassMapping,
  validateClassMappingUpdate,
  validateExamination,
  validateExaminationUpdate,
  validateExaminationDataAccess,
  validateExaminationDataAccessUpdate
};