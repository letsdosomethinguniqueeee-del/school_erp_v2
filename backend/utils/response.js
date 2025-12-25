// Response Utility Functions
const { HTTP_STATUS } = require('../config/constants');

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 * @returns {object} - JSON response
 */
const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errors - Error details
 * @returns {object} - JSON response
 */
const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {array} errors - Validation errors
 * @returns {object} - JSON response
 */
const sendValidationError = (res, errors) => {
  return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors);
};

/**
 * Send unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} - JSON response
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, HTTP_STATUS.UNAUTHORIZED, message);
};

/**
 * Send forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} - JSON response
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, HTTP_STATUS.FORBIDDEN, message);
};

/**
 * Send not found response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} - JSON response
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound
};
