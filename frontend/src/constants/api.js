// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  CHECK_AUTH: '/api/auth/check',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // User Management
  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`,
  CREATE_USER: '/api/users',
  UPDATE_USER: (id) => `/api/users/${id}`,
  DELETE_USER: (id) => `/api/users/${id}`,

  // Students
  STUDENTS: '/api/students',
  STUDENT_BY_ID: (id) => `/api/students/${id}`,

  // Parents
  PARENTS: '/api/parents',
  PARENT_BY_ID: (id) => `/api/parents/${id}`,

  // Teachers
  TEACHERS: '/api/teachers',
  TEACHER_BY_ID: (id) => `/api/teachers/${id}`,

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_STATS: '/api/admin/stats',

  // Fees
  FEES: '/api/fees',
  FEE_STRUCTURE: '/api/fees/structure',

  // Transactions
  TRANSACTIONS: '/api/transactions',
  TRANSACTION_BY_ID: (id) => `/api/transactions/${id}`,

  // Academic Years
  ACADEMIC_YEARS: '/api/academic-years',
  ACADEMIC_YEAR_BY_ID: (id) => `/api/academic-years/${id}`,
  CURRENT_ACADEMIC_YEAR: '/api/academic-years/current',

  // Subjects
  SUBJECTS: '/api/subjects',
  SUBJECT_BY_ID: (id) => `/api/subjects/${id}`,

  // Streams
  STREAMS: '/api/streams',
  STREAM_BY_ID: (id) => `/api/streams/${id}`,

  // Mediums
  MEDIUMS: '/api/mediums',
  MEDIUM_BY_ID: (id) => `/api/mediums/${id}`,

  // Classes
  CLASSES: '/api/classes',
  CLASS_BY_ID: (id) => `/api/classes/${id}`,

  // Sections
  SECTIONS: '/api/sections',
  SECTION_BY_ID: (id) => `/api/sections/${id}`,

  // Class Mappings
  CLASS_MAPPINGS: '/api/class-mappings',
  CLASS_MAPPING_BY_ID: (id) => `/api/class-mappings/${id}`
  ,
  // Examinations
  EXAMINATIONS: '/api/examinations',
  EXAMINATION_BY_ID: (id) => `/api/examinations/${id}`,
  EXAMINATIONS_BULK: '/api/examinations/bulk',
  
  // Examination Data Access
  EXAMINATION_DATA_ACCESS: '/api/examination-data-access',
  EXAMINATION_DATA_ACCESS_BY_ID: (id) => `/api/examination-data-access/${id}`,
  CHECK_USER_ACCESS: '/api/examination-data-access/check-access',

  // Examination Marks
  EXAMINATION_MARKS: '/api/examination-marks',
  EXAMINATION_MARKS_BULK: '/api/examination-marks/bulk',
  EXAMINATION_MARKS_STUDENT: (studentId) => `/api/examination-marks/student/${studentId}`,

  // Student Exam Results
  STUDENT_EXAM_RESULTS: '/api/student-exam-results',
  STUDENT_ACADEMIC_YEARS: '/api/student-exam-results/student/academic-years',
  STUDENT_CLASSES: '/api/student-exam-results/student/classes',
  STUDENT_PUBLISHED_EXAMS: '/api/student-exam-results/student/published',
  STUDENT_EXAM_RESULTS_DATA: '/api/student-exam-results/student/results',
  STUDENT_FINAL_RESULT: '/api/student-exam-results/student/final-result',
  PUBLISH_EXAM_RESULTS: '/api/student-exam-results/publish',
  PUBLISH_FINAL_RESULTS: '/api/student-exam-results/publish-final'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const API_TIMEOUT = 10000; // 10 seconds
