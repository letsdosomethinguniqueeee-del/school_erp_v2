/**
 * Corporate-grade logging utility for security and application events
 * Follows enterprise logging standards with proper categorization
 */

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
  }

  // Log levels in order of severity
  levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  formatMessage(level, category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    return logEntry;
  }

  // Security-related logging
  security = {
    loginAttempt: (userId, role, success, error = null) => {
      const message = success 
        ? `Successful login attempt for user: ${userId} with role: ${role}`
        : `Failed login attempt for user: ${userId} with role: ${role}. Error: ${error}`;
      
      const logEntry = this.formatMessage('INFO', 'SECURITY', message, {
        userId,
        role,
        success,
        error,
        ip: 'client-side' // Will be captured by server
      });

      this.log('INFO', logEntry);
    },

    accessDenied: (userId, role, attemptedRoute, reason) => {
      const message = `Access denied for user ${userId} (${role}) to route ${attemptedRoute}. Reason: ${reason}`;
      const logEntry = this.formatMessage('WARN', 'SECURITY', message, {
        userId,
        role,
        attemptedRoute,
        reason
      });

      this.log('WARN', logEntry);
    },

    sessionExpired: (userId, role) => {
      const message = `Session expired for user: ${userId} with role: ${role}`;
      const logEntry = this.formatMessage('INFO', 'SECURITY', message, {
        userId,
        role
      });

      this.log('INFO', logEntry);
    },

    logout: (userId, role) => {
      const message = `User logout: ${userId} with role: ${role}`;
      const logEntry = this.formatMessage('INFO', 'SECURITY', message, {
        userId,
        role
      });

      this.log('INFO', logEntry);
    }
  };

  // Application logging
  application = {
    error: (error, context = {}) => {
      const message = `Application error: ${error.message}`;
      const logEntry = this.formatMessage('ERROR', 'APPLICATION', message, {
        error: error.toString(),
        stack: error.stack,
        context
      });

      this.log('ERROR', logEntry);
    },

    performance: (operation, duration, details = {}) => {
      const message = `Performance: ${operation} took ${duration}ms`;
      const logEntry = this.formatMessage('INFO', 'PERFORMANCE', message, {
        operation,
        duration,
        details
      });

      this.log('INFO', logEntry);
    },

    userAction: (action, userId, role, details = {}) => {
      const message = `User action: ${action} by ${userId} (${role})`;
      const logEntry = this.formatMessage('INFO', 'USER_ACTION', message, {
        action,
        userId,
        role,
        details
      });

      this.log('INFO', logEntry);
    }
  };

  log(level, logEntry) {
    if (!this.shouldLog(level)) return;

    // Console logging for development
    if (this.isDevelopment) {
      const consoleMethod = level === 'ERROR' ? 'error' : 
                           level === 'WARN' ? 'warn' : 'log';
      console[consoleMethod](`[${logEntry.timestamp}] ${logEntry.category}: ${logEntry.message}`, logEntry.data);
    }

    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(logEntry);
    }
  }

  sendToLoggingService(logEntry) {
    // TODO: Implement integration with logging service (e.g., Sentry, LogRocket, etc.)
    // For now, we'll store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 100 logs to prevent storage bloat
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log entry:', error);
    }
  }

  // Utility method to get stored logs (for debugging)
  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      console.error('Failed to retrieve stored logs:', error);
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    localStorage.removeItem('app_logs');
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
