const logger = {
  application: {
    userAction: (action, userId, userRole, details = {}) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] USER_ACTION: ${action}`, {
        userId,
        userRole,
        details
      });
    },
    
    error: (error, context = {}) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] APPLICATION_ERROR:`, {
        error: error.message || error,
        stack: error.stack,
        context
      });
    },
    
    info: (message, context = {}) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO: ${message}`, context);
    },
    
    warn: (message, context = {}) => {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARNING: ${message}`, context);
    }
  },
  
  security: {
    loginAttempt: (userId, success, ip, userAgent) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] LOGIN_ATTEMPT:`, {
        userId,
        success,
        ip,
        userAgent
      });
    },
    
    unauthorizedAccess: (userId, resource, ip) => {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] UNAUTHORIZED_ACCESS:`, {
        userId,
        resource,
        ip
      });
    }
  }
};

module.exports = logger;
