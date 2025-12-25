import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import logger from '../utils/logger';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Set up session timeout monitoring
  useEffect(() => {
    if (isAuthenticated && user) {
      const tokenExpiry = user.tokenExpiry || Date.now() + (24 * 60 * 60 * 1000); // Default 24h
      const timeUntilExpiry = tokenExpiry - Date.now();
      
      if (timeUntilExpiry > 0) {
        const timeoutId = setTimeout(() => {
          console.log('Session expired, logging out user');
          setSessionExpired(true);
          handleSessionExpiry();
        }, timeUntilExpiry);
        
        return () => clearTimeout(timeoutId);
      } else {
        // Token already expired
        setSessionExpired(true);
        handleSessionExpiry();
      }
    } else {
      // Clear any existing timeout if user is not authenticated
      setSessionExpired(false);
    }
  }, [isAuthenticated, user]);

  const handleSessionExpiry = () => {
    if (user) {
      logger.security.sessionExpired(user.userId, user.role);
    }
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpired(true);
    // Clear any stored tokens
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const response = await api.get('/api/auth/check');
      
      if (response.data.user) {
        console.log('User authenticated:', response.data.user.userId, response.data.user.role);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setSessionExpired(false);
        logger.security.loginAttempt(response.data.user.userId, response.data.user.role, true);
      } else {
        console.log('No user data in response');
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(false);
      }
    } catch (error) {
      console.log('Authentication check failed:', error.response?.status, error.message);
      // Handle different error types
      if (error.response?.status === 401) {
        console.log('No active session found or authentication failed');
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(false); // Don't set session expired for 401, just clear auth state
      } else if (error.response?.status === 403) {
        console.log('Access denied - insufficient permissions');
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(false);
      } else {
        console.error('Authentication check failed:', error.message);
        // Don't clear session for network errors
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId, password, role) => {
    try {
      const response = await api.post('/api/auth/login', {
        userId,
        password,
        role
      });

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setSessionExpired(false); // Reset session expiry state on successful login
        logger.security.loginAttempt(response.data.user.userId, response.data.user.role, true);
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      logger.security.loginAttempt(userId, role, false, errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        logger.security.logout(user.userId, user.role);
      }
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication state immediately
      setUser(null);
      setIsAuthenticated(false);
      setSessionExpired(false);
      
      // Clear any stored tokens from cookies (as backup)
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      console.log('Logout completed - authentication state cleared');
    }
  };

  const clearSessionExpiry = () => {
    setSessionExpired(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    sessionExpired,
    login,
    logout,
    checkAuthStatus,
    clearSessionExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
