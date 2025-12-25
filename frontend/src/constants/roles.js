// User Roles Configuration
export const USER_ROLES = {
  STUDENT: 'student',
  PARENT: 'parent',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
  STAFF: 'staff'
};

export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.PARENT]: 'Parent',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.STAFF]: 'Staff'
};

export const ROLE_PLACEHOLDERS = {
  [USER_ROLES.STUDENT]: 'STU001',
  [USER_ROLES.PARENT]: 'PAR001',
  [USER_ROLES.TEACHER]: 'TCH001',
  [USER_ROLES.ADMIN]: 'ADM001',
  [USER_ROLES.SUPER_ADMIN]: 'SUP001',
  [USER_ROLES.STAFF]: 'STF001'
};

export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.STUDENT]: 'Access to student portal and academic information',
  [USER_ROLES.PARENT]: 'View child\'s academic progress and school updates',
  [USER_ROLES.TEACHER]: 'Manage classes, grades, and student information',
  [USER_ROLES.ADMIN]: 'School administration and user management',
  [USER_ROLES.SUPER_ADMIN]: 'System-wide administration and configuration',
  [USER_ROLES.STAFF]: 'Non-teaching staff access to relevant systems'
};
