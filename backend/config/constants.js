// Application constants and configuration

const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  STAFF: 'staff'
};

const VALID_ROLES = Object.values(ROLES);

const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

const STUDENT_ID_FORMAT = {
  PREFIX: 'DPS',
  YEAR_LENGTH: 4,
  SEQUENCE_LENGTH: 3
};

const PASSWORD_POLICY = {
  MIN_LENGTH: 6,
  REQUIRE_UPPERCASE: false,
  REQUIRE_LOWERCASE: false,
  REQUIRE_NUMBERS: false,
  REQUIRE_SYMBOLS: false
};

const JWT_CONFIG = {
  EXPIRY: process.env.JWT_EXPIRY || '24h',
  REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d'
};

const RATE_LIMITS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts, please try again later'
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later'
  }
};

const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  UPLOAD_PATH: 'uploads/'
};

const ACADEMIC_YEARS = {
  CURRENT_YEAR: new Date().getFullYear(),
  GENERATE_YEARS: (count = 6) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < count; i++) {
      const year = currentYear + i;
      years.push(`${year}-${year + 1}`);
    }
    return years;
  }
};

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMUNITIES = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const CONCESSION_LIMITS = {
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 100
};

const RESPONSE_MESSAGES = {
  SUCCESS: {
    STUDENT_CREATED: 'Student created successfully',
    STUDENT_UPDATED: 'Student updated successfully',
    STUDENT_DELETED: 'Student deleted successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful'
  },
  ERROR: {
    STUDENT_NOT_FOUND: 'Student not found',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCESS_DENIED: 'Access denied',
    VALIDATION_FAILED: 'Validation failed',
    DUPLICATE_STUDENT_ID: 'Student ID already exists',
    DUPLICATE_ROLL_NUMBER: 'Roll number already exists in this class',
    INVALID_ROLE: 'Invalid role specified',
    SESSION_EXPIRED: 'Session expired',
    INTERNAL_ERROR: 'Internal server error'
  }
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  ROLES,
  VALID_ROLES,
  PAGINATION,
  STUDENT_ID_FORMAT,
  PASSWORD_POLICY,
  JWT_CONFIG,
  RATE_LIMITS,
  FILE_UPLOAD,
  ACADEMIC_YEARS,
  CLASSES,
  SECTIONS,
  BLOOD_GROUPS,
  COMMUNITIES,
  CATEGORIES,
  GENDER_OPTIONS,
  CONCESSION_LIMITS,
  RESPONSE_MESSAGES,
  HTTP_STATUS
};